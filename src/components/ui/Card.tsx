// src/components/ui/Card.tsx
import React from "react";
import styled from "styled-components";

const Card: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="spin-orbit">
        {/* back cards */}
        <div className="card card-back card-back-1" />
        <div className="card card-back card-back-2" />

        {/* main front card */}
        <div className="card card-main">
          <div className="card-glow" />
          <div className="card-header">
            <span className="brand">FixOnWheels</span>
            <span className="tag">VIRTUAL</span>
          </div>

          <div className="chip-row">
            <div className="chip" />
            <div className="wave" />
          </div>

          <div className="number-row">
            <span className="dots">•••• •••• ••••</span>
            <span className="last4">4823</span>
          </div>

          <div className="meta-row">
            <div className="label">
              <span className="label-caption">CARD HOLDER</span>
              <span className="label-value">Guest User</span>
            </div>
            <div className="label">
              <span className="label-caption">EXPIRES</span>
              <span className="label-value">12/28</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* purely visual */
  isolation: isolate;

  .spin-orbit {
    position: relative;
    width: 160px;
    height: 160px;
    perspective: 900px;
    transform-style: preserve-3d;
    animation: orbit 5.5s linear infinite;
  }

  .card {
    position: absolute;
    width: 150px;
    height: 94px;
    border-radius: 18px;
    background: radial-gradient(circle at 0% 0%, #ffffff30, transparent 55%),
      linear-gradient(135deg, #181827, #040010);
    box-shadow:
      0 0 20px rgba(124, 58, 237, 0.4),
      0 0 40px rgba(56, 189, 248, 0.25);
    overflow: hidden;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .card-main {
    top: 50%;
    left: 50%;
    transform-origin: center;
    transform: translate(-50%, -50%) rotateX(18deg) rotateY(0deg);
    animation: spinCard 3.8s ease-in-out infinite;
  }

  .card-back {
    top: 50%;
    left: 50%;
    transform-origin: center;
    filter: blur(1px);
    opacity: 0.6;
  }

  .card-back-1 {
    transform: translate(-50%, -50%) translateX(-18px) translateY(10px)
      rotateX(18deg) rotateY(-18deg) scale(0.92);
    background: linear-gradient(135deg, #0f172a, #1d1b3a);
  }

  .card-back-2 {
    transform: translate(-50%, -50%) translateX(18px) translateY(14px)
      rotateX(18deg) rotateY(22deg) scale(0.88);
    background: linear-gradient(135deg, #020617, #111827);
  }

  .card-glow {
    position: absolute;
    inset: -40%;
    background:
      radial-gradient(circle at 0% 0%, rgba(129, 140, 248, 0.7), transparent),
      radial-gradient(circle at 100% 100%, rgba(45, 212, 191, 0.7), transparent);
    opacity: 0.55;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .card-header {
    position: relative;
    z-index: 2;
    padding: 10px 14px 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter",
      sans-serif;
  }

  .brand {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #e5e7eb;
  }

  .tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 999px;
    border: 1px solid rgba(209, 213, 219, 0.4);
    color: #e5e7eb;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.2));
  }

  .chip-row {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px 0 14px;
  }

  .chip {
    width: 24px;
    height: 18px;
    border-radius: 5px;
    background: linear-gradient(135deg, #facc15, #f97316);
    box-shadow:
      0 0 6px rgba(250, 204, 21, 0.9),
      inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .chip::before,
  .chip::after {
    content: "";
    position: absolute;
    inset: 4px;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.28);
  }

  .wave {
    width: 18px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(248, 250, 252, 0.6);
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(40deg) translateY(2px);
    opacity: 0.75;
  }

  .number-row {
    position: relative;
    z-index: 2;
    padding: 8px 14px 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    color: #f9fafb;
  }

  .dots {
    font-size: 11px;
    letter-spacing: 0.22em;
    opacity: 0.8;
  }

  .last4 {
    font-size: 13px;
    font-weight: 600;
  }

  .meta-row {
    position: relative;
    z-index: 2;
    padding: 8px 14px 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter",
      sans-serif;
  }

  .label {
    display: flex;
    flex-direction: column;
  }

  .label-caption {
    font-size: 7px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(226, 232, 240, 0.7);
  }

  .label-value {
    font-size: 10px;
    color: #f9fafb;
  }

  @keyframes orbit {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

  @keyframes spinCard {
    0% {
      transform: translate(-50%, -50%) rotateX(18deg) rotateY(-18deg);
    }
    25% {
      transform: translate(-50%, -50%) rotateX(20deg) rotateY(10deg);
    }
    50% {
      transform: translate(-50%, -50%) rotateX(16deg) rotateY(24deg)
        translateY(-4px);
    }
    75% {
      transform: translate(-50%, -50%) rotateX(18deg) rotateY(-6deg)
        translateY(2px);
    }
    100% {
      transform: translate(-50%, -50%) rotateX(18deg) rotateY(-18deg);
    }
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;

    .spin-orbit {
      width: 140px;
      height: 140px;
    }

    .card {
      width: 130px;
      height: 82px;
      border-radius: 16px;
    }
  }
`;

export default Card;
