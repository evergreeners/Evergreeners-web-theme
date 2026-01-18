import "./loader.css";

export function Loader() {
    return (
        <div className="loader-wrapper">
            <div className="loader-circle"></div>
            <div className="loader-circle"></div>
            <div className="loader-circle"></div>
            <div className="loader-shadow"></div>
            <div className="loader-shadow"></div>
            <div className="loader-shadow"></div>
        </div>
    );
}
