type Props = {
  currentStep: number;
  totalSteps: number;
};

const StepProgress = ({ currentStep, totalSteps }: Props) => {
  return (
    <div style={{ display: "flex", marginBottom: 20 }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;

        let bg = "#ccc";

        if (step < currentStep) bg = "#2ecc71"; // green
        else if (step === currentStep) bg = "#4a6cf7"; // blue

        return (
          <div key={step} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                margin: "0 auto",
                lineHeight: "32px",
                background: bg,
                color: "#fff"
              }}
            >
              {step}
            </div>

            <p style={{ fontSize: 12, marginTop: 6 }}>
              Step {step}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;