export default function FeaturePage() {
  return (
    <div className="container py-5 text-primary">
      <h1 className="fw-bold text-center mb-4">Key Features</h1>
      <hr />
      <p className="lead text-center mb-5">
        Explore the powerful features that make our HR Management Portal
        efficient, scalable, and easy to use.
      </p>

      <div className="row g-4 text-secondary">
        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Onboarding Workflow
            </h4>
            <hr className="dark" />
            <p>
              Seamlessly onboard new hires with customizable forms, document
              uploads, and automated approval steps.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Employee Records
            </h4>
            <hr className="dark" />
            <p>
              Manage employee profiles, contact details, and status updates—all
              in one secure and accessible location.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Document Management
            </h4>
            <hr className="dark" />
            <p>
              Upload and track important documents like work authorization,
              licenses, and contracts with version control.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Role-Based Access
            </h4>
            <hr className="dark" />
            <p>
              Ensure security and clarity by assigning permissions based on
              roles (HR, Employee, Admin).
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Application Status Tracking
            </h4>
            <hr className="dark" />
            <p>
              Employees can easily check the progress and results of their
              onboarding application in real-time.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm bg-light rounded h-100">
            <h4 className="fw-semibold text-truncate text-center">
              Audit & Compliance
            </h4>
            <hr className="dark" />
            <p>
              Maintain a clear audit trail and ensure compliance with HR
              standards and regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
