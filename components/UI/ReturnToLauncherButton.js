import { useSearchParams } from "next/navigation";
import ArticlesButton from "./Button";

export default function ReturnToLauncherButton() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries())
    let {
        controllerMode,
        launcher_mode,
    } = searchParamsObject

    launcher_mode = launcher_mode === '1' ? true : false

    // const router = useRouter()

    if (!launcher_mode) {
        return null
    }

    return (
        <ArticlesButton
            // ref={el => elementsRef.current[6] = el}
            className={`w-100`}
            small
            style={{
                zIndex: 10,
                position: "relative",
            }}
            onClick={() => {
                // window.history.back()
                window.location.href = `https://games.articles.media`
            }}
        >
            <i className="fad fa-gamepad"></i>
            Return to Games
        </ArticlesButton>
    );
}   