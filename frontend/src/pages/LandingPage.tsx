import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmazon,
  faDiscord,
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function LandingPage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5 p-5 text-primary">
      <div className="text-center">
        <h1 className="fw-bold display-4">The Management Portal System</h1>
        <p className="lead">
          <span className="fw-semibold text-primary">Streamline</span> your HR
          operations with our
          <span className="fw-semibold text-decoration-underline">
            {" "}
            centralized system
          </span>{" "}
          — manage
          <span className="fw-bold"> onboarding</span>,
          <span className="fw-bold"> employee records</span>, and
          <span className="fw-bold"> approvals</span> all in one place.
        </p>
      </div>

      <div className="mt-5 d-flex gap-3">
        {/* Sign up for Free | Is this for me? (redirect to about page) */}
        <Link to={"/login"} className="btn btn-primary px-4">
          Sign up for Free
        </Link>
        <Link to={"/features"} className="btn btn-secondary px-4">
          Is this for me?
        </Link>
      </div>

      <div className="mt-5">
        <p className="text-center mb-4">
          Already have an account?{" "}
          <Link to={"/login"} className="fw-bold text-decoration-none px-2">
            Login
          </Link>
        </p>
        {/* bunch of random icons */}
        <div className="d-flex justify-content-center gap-3">
          <ul className="list-unstyled d-flex gap-3">
            <li className="cursor-pointer">
              <FontAwesomeIcon icon={faGithub} size="2xl" />
            </li>
            <li className="cursor-pointer">
              <FontAwesomeIcon icon={faLinkedinIn} size="2xl" />
            </li>
            <li className="cursor-pointer">
              <FontAwesomeIcon icon={faAmazon} size="2xl" />
            </li>
            <li className="cursor-pointer">
              <FontAwesomeIcon icon={faTwitter} size="2xl" />
            </li>
            <li className="cursor-pointer">
              <FontAwesomeIcon icon={faDiscord} size="2xl" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
