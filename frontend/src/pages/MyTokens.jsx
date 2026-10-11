import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getUserTokens,
  cancelToken
} from "../services/api";

function MyTokens() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadTokens = async () => {

    if (!user?.id) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await getUserTokens(user.id);

      setTokens(response.data);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load your tokens."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadTokens();

  }, []);


  const handleCancel = async (tokenId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this token?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await cancelToken(tokenId);

      await loadTokens();

    } catch (err) {

      console.error(err);

      setError(
        "Unable to cancel the token."
      );

    }

  };


  if (loading) {

    return (

      <main className="my-tokens-page">

        <div className="tokens-loading">

          <div className="loading-circle"></div>

          <h2>
            Loading your tokens...
          </h2>

          <p>
            Please wait a moment.
          </p>

        </div>

      </main>

    );

  }


  return (

    <main className="my-tokens-page">

      <div className="tokens-background"></div>


      <section className="tokens-header">

        <div>

          <div className="tokens-label">
            QUEUE CENTER
          </div>

          <h1>
            My Tokens
          </h1>

          <p>
            Track and manage your digital queue tokens.
          </p>

        </div>


        <Link
          to="/get-token"
          className="new-token-button"
        >
          + Get New Token
        </Link>

      </section>


      {error && (
        <div className="tokens-error">
          {error}
        </div>
      )}


      {tokens.length === 0 ? (

        <section className="empty-tokens">

          <div className="empty-icon">
            🎟
          </div>

          <h2>
            No tokens yet
          </h2>

          <p>
            You haven't joined any queue yet.
            Get your first digital token now.
          </p>

          <Link
            to="/get-token"
            className="empty-token-button"
          >
            Get My First Token →
          </Link>

        </section>

      ) : (

        <section className="tokens-grid">

          {tokens.map((token) => {

            const status =
              token.status?.toUpperCase();

            const isWaiting =
              status === "WAITING";

            const isServing =
              status === "SERVING";

            const isCompleted =
              status === "COMPLETED";

            const isCancelled =
              status === "CANCELLED";


            return (

              <article
                className="my-token-card"
                key={token.id}
              >

                <div className="my-token-top">

                  <div>

                    <span>
                      TOKEN NUMBER
                    </span>

                    <strong>
                      {token.tokenNumber}
                    </strong>

                  </div>


                  <div
                    className={`status-pill-large ${
                      isWaiting
                        ? "status-waiting"
                        : isServing
                        ? "status-serving"
                        : isCompleted
                        ? "status-completed"
                        : "status-cancelled"
                    }`}
                  >

                    <i></i>

                    {token.status}

                  </div>

                </div>


                <div className="token-service-name">

                  <small>
                    SERVICE
                  </small>

                  <h3>
                    {token.service?.serviceName ||
                      "Service"}
                  </h3>

                  <p>
                    {token.service?.description ||
                      "Queue service"}
                  </p>

                </div>


                <div className="token-information">

                  <div>

                    <span>
                      CREATED
                    </span>

                    <strong>
                      {token.createdAt
                        ? new Date(
                            token.createdAt
                          ).toLocaleString()
                        : "-"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      TOKEN ID
                    </span>

                    <strong>
                      #{token.id}
                    </strong>

                  </div>

                </div>


                {isWaiting && (

                  <button
                    className="cancel-token-button"
                    onClick={() =>
                      handleCancel(token.id)
                    }
                  >
                    Cancel Token
                  </button>

                )}


                {isServing && (

                  <div className="serving-message">
                    <span>●</span>
                    Your token is being served now
                  </div>

                )}


                {isCompleted && (

                  <div className="completed-message">
                    ✓ Service completed successfully
                  </div>

                )}


                {isCancelled && (

                  <div className="cancelled-message">
                    Token cancelled
                  </div>

                )}

              </article>

            );

          })}

        </section>

      )}

    </main>

  );
}

export default MyTokens;