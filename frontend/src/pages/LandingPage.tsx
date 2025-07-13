import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmazon,
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function LandingPage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5">
      <div className="text-center">
        <h1 className="fw-bold display-4">The Management Portal System</h1>
        <p className="lead">Welcome to our management portal system.</p>
      </div>

      <div className="mt-5 d-flex gap-3">
        {/* Sign up for Free | Is this for me? (redirect to about page) */}
        <Link to={"/login"} className="btn btn-primary px-4">
          Sign up for Free
        </Link>
        <Link to={"/about"} className="btn btn-secondary px-4">
          Is this for me?
        </Link>
      </div>

      <div className="mt-5">
        <p>
          Already have an account?{" "}
          <Link to={"/login"} className="fw-bold text-decoration-none">
            Login
          </Link>
        </p>
        {/* bunch of random icons */}
        <div className="d-flex gap-3">
          <FontAwesomeIcon icon={faGithub} size="2xl" />
          <FontAwesomeIcon icon={faLinkedinIn} size="2xl" />
          <FontAwesomeIcon icon={faTwitter} size="2xl" />
          <FontAwesomeIcon icon={faAmazon} size="2xl" />
        </div>
      </div>
    </div>
  );
}
