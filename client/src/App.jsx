import { KompitrailProvider } from "../context/KompitrailContext";
import { GlobalRouter } from "./routes/GlobalRouter";

export function App() {
  return (
    <>
      <KompitrailProvider>
        <GlobalRouter/>
      </KompitrailProvider>
    </>
  )
}


