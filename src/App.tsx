import { useState } from "react";
import { ExtratoPage } from "./pages/ExtratoPage";
import { FaturasPage } from "./pages/FaturasPage";

function App() {
  const [activeScreen, setActiveScreen] = useState<"extrato" | "faturas">("extrato");
  const [customerExternalId, setCustomerExternalId] = useState("cli-pre-001");

  if (activeScreen === "faturas") {
    return (
      <FaturasPage
        activeScreen={activeScreen}
        customerExternalId={customerExternalId}
        onCustomerChange={setCustomerExternalId}
        onScreenChange={setActiveScreen}
      />
    );
  }

  return (
    <ExtratoPage
      activeScreen={activeScreen}
      customerExternalId={customerExternalId}
      onCustomerChange={setCustomerExternalId}
      onScreenChange={setActiveScreen}
    />
  );
}

export default App;
