
import { useEffect } from "react";
import { Tab, Tabs, Spinner, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    fetchInProgress,
    fetchAll,
    setSearchTerm,
    approveDoc,
    rejectDoc,
    sendReminder,
} from "../../store/slices/visaSlice";

import InProgressTable from "../../components/hrVisaStatusManagement/InProgressTable";
import AllRecordsTable from "../../components/hrVisaStatusManagement/AllRecordsTable";

export default function VisaStatusManagementPage() {
    const dispatch = useAppDispatch();

    // 1. Pull state from the visa slice
    // read exactly the slice of Redux state we need
    const { inProgress, all, loading, error, searchTerm } = useAppSelector(
        (state) => state.visa
    );

    // 2. On mount: load both lists
    // initial data load
    useEffect(() => {
        dispatch(fetchInProgress());
        dispatch(fetchAll(searchTerm));
    }, [dispatch, searchTerm]);

    // 3. Whenever searchTerm changes, reload the “All” list
    useEffect(() => {
        dispatch(fetchAll(searchTerm));
    }, [dispatch, searchTerm]);

    // 4. Handlers for table actions
    const handleApprove = (
        userId: string,
        docType: string,
        dates?: { startDate: string; endDate: string }
    ) => {
        dispatch(approveDoc({ userId, docType, ...dates })).then(() => {
        dispatch(fetchInProgress());
        dispatch(fetchAll(searchTerm));
        });
    };

    const handleReject = (
        userId: string,
        docType: string,
        feedback: string
    ) => {
        dispatch(rejectDoc({ userId, docType, feedback })).then(() => {
        dispatch(fetchInProgress());
        dispatch(fetchAll(searchTerm));
        });
    };

    const handleNotify = (userId: string) => {
        dispatch(sendReminder(userId)).then(() => {
        dispatch(fetchInProgress());
        // no need to reload “All” here
        });
    };

    const handleSearch = (term: string) => {
        dispatch(setSearchTerm(term));
        // fetchAll will run automatically via the effect
    };

    return (
        <div className="p-4">
            <h1>Visa Status Management</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs defaultActiveKey="inProgress" id="visa-status-tabs" className="my-3">
                <Tab eventKey="inProgress" title="In Progress">
                    {loading ? (
                        <Spinner animation="border" className="mt-4" />
                    ) : (
                        <InProgressTable
                        data={inProgress}
                        loading={loading}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onNotify={handleNotify}
                        />
                    )}
                </Tab>

                <Tab eventKey="all" title="All">
                    {loading ? (
                        <Spinner animation="border" className="mt-4" />
                    ) : (
                        <AllRecordsTable
                        data={all}
                        loading={loading}
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        />
                    )}
                </Tab>
            </Tabs>
        </div>
    );
}