import { KompitrailProvider } from "../context/KompitrailContext";
import { Kompitrail } from "./routes/Kompitrail";

export function App() {
  return (
    <>
      <KompitrailProvider>
        <Kompitrail/>
      </KompitrailProvider>
    </>
  )
}


