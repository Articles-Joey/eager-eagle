import ArticlesButton from "@/components/UI/Button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div
            style={{
                height: "100svh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <img src="img/icon.png" height={200} alt="Logo" />
            <h1 className="text-4xl font-bold mb-1">404 - Page Not Found</h1>
            <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
            <Link
                href="/"
            >
                <ArticlesButton>
                    Return to Home
                </ArticlesButton>
            </Link>
        </div>
    )
}