export default function AboutPage() {
  return (
    <div className="container py-5 text-primary">
      <h1 className="fw-bold text-center mb-4">About Us</h1>
      <hr />
      <p className="lead text-center mb-5">
        Learn more about our mission, vision, and the team behind the HR
        Management Portal.
      </p>

      <div className="row g-4 text-secondary">
        <div className="col-md-6">
          <div className="p-4 shadow-sm bg-light rounded">
            <h3 className="fw-semibold text-center">Our Mission</h3>
            <hr className="dark"/>
            <p>
              Our mission is to simplify and enhance the HR experience for
              businesses by providing a centralized, user-friendly platform for
              onboarding, employee records management, and approvals.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 shadow-sm bg-light rounded">
            <h3 className="fw-semibold text-center">Our Vision</h3>
            <hr className="dark"/>
            <p>
              We envision a world where HR operations are efficient, paperless,
              and automated—enabling HR professionals to focus on people, not
              paperwork.
            </p>
          </div>
        </div>
        <div className="col-12">
          <div className="p-4 shadow-sm bg-light rounded">
            <h3 className="fw-semibold text-center">Our Team</h3>
            <hr className="dark"/>
            <p>
              We are a passionate team of developers, designers, and HR
              specialists committed to creating tools that empower organizations
              to manage their workforce with ease and confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
