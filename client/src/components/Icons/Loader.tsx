import { LoaderCircle } from "lucide-react";

const App = () => {
    const spinStyle = {
        animation: "spin 1.5s linear infinite",
        "@keyframes spin": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
        },
    };

    return (
        <LoaderCircle style={spinStyle} size={48} />
    );
};

export default App;
