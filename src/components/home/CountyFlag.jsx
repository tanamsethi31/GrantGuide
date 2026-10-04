import React from "react";

const COLOURS = {
  Antrim: ["#FFB300", "#FFFFFF"], Armagh: ["#F57C00", "#FFFFFF"], Carlow: ["#D32F2F", "#2E7D32"],
  Cavan: ["#1976D2", "#FFFFFF"], Clare: ["#FFB300", "#1976D2"], Cork: ["#D32F2F", "#FFFFFF"],
  Derry: ["#D32F2F", "#FFFFFF"], Donegal: ["#2E7D32", "#FFB300"], Down: ["#D32F2F", "#222222"],
  Dublin: ["#4FC3F7", "#0D2B6B"], Fermanagh: ["#2E7D32", "#FFFFFF"], Galway: ["#7B1F3A", "#FFFFFF"],
  Kerry: ["#2E7D32", "#FFB300"], Kildare: ["#FFFFFF", "#222222"], Kilkenny: ["#222222", "#FFB300"],
  Laois: ["#1976D2", "#FFFFFF"], Leitrim: ["#2E7D32", "#FFB300"], Limerick: ["#2E7D32", "#FFFFFF"],
  Longford: ["#1976D2", "#FFB300"], Louth: ["#D32F2F", "#FFFFFF"], Mayo: ["#2E7D32", "#D32F2F"],
  Meath: ["#2E7D32", "#FFB300"], Monaghan: ["#FFFFFF", "#1976D2"], Offaly: ["#2E7D32", "#FFB300"],
  Roscommon: ["#F6E27A", "#1976D2"], Sligo: ["#222222", "#FFFFFF"], Tipperary: ["#1976D2", "#FFB300"],
  Tyrone: ["#D32F2F", "#FFFFFF"], Waterford: ["#FFFFFF", "#1976D2"], Westmeath: ["#7B1F3A", "#FFFFFF"],
  Wexford: ["#6A1B9A", "#FFB300"], Wicklow: ["#1976D2", "#FFB300"],
};

export default function CountyFlag({ county }) {
  const [a, b] = COLOURS[county] || ["#169B62", "#FF883E"];
  return (
    <span
      className="inline-flex flex-col w-7 h-5 mr-3 rounded-sm overflow-hidden border border-[#dddddd] align-middle"
      aria-label={`${county} colours`}
    >
      <span className="flex-1" style={{ backgroundColor: a }} />
      <span className="flex-1" style={{ backgroundColor: b }} />
    </span>
  );
}