import React from "react";
import Dropdown from "react-dropdown";

const SummarySettings = () => {
  return (
    <div>
      <h3>Summary Settings</h3>

      <label style={{ display: "block" }}>
        Summary prompt
        <input type="text" value="Prompt for the summaries" />
      </label>

      <label style={{ display: "block" }}>
        Summary model
        <Dropdown options={["inky", "stinky", "blinky", "clyde"]} />
      </label>
    </div>
  );
};

export default SummarySettings;
