interface ScreenTabsProps {
  activeScreen: "extrato" | "faturas";
  onScreenChange: (screen: "extrato" | "faturas") => void;
}

export function ScreenTabs({
  activeScreen,
  onScreenChange,
}: ScreenTabsProps) {
  return (
    <div className="view-switch" aria-label="Navegacao principal">
      <button
        className={`view-switch-button ${activeScreen === "extrato" ? "is-active" : ""}`}
        onClick={() => onScreenChange("extrato")}
        type="button"
      >
        Extrato
      </button>
      <button
        className={`view-switch-button ${activeScreen === "faturas" ? "is-active" : ""}`}
        onClick={() => onScreenChange("faturas")}
        type="button"
      >
        Faturas
      </button>
    </div>
  );
}
