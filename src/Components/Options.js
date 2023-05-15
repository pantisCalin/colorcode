import React from "react";

const Options = ({
  keyWords,
  changeKeyWords,
  variableColors,
  changeColorPredifined,
  changeDigits,
  digits,
  savePDF,
  dim,
  resizePannel,
  globalOptions,
  changeGlobalOptions,
}) => {
  return (
    <div className="options">
      <div className="optionSet">
        <div>Width</div>
        <input
          name="width"
          type="number"
          onChange={resizePannel}
          defaultValue={dim.width}
        />
      </div>
      <div className="optionSet">
        <div>Height</div>
        <input
          name="height"
          type="number"
          onChange={resizePannel}
          defaultValue={dim.height}
        />
      </div>
      {keyWords.map((instance, index) => (
        <div className="optionSet" key={index}>
          <div>{`Keywords number ${index + 1}: `}</div>
          <input
            type="text"
            name={index}
            value={instance.text}
            onChange={(e) =>
              changeKeyWords(e.target.value, parseInt(index), "text")
            }
          />
          <input
            type="color"
            onChange={(e) =>
              changeKeyWords(e.target.value, parseInt(index), "color")
            }
            defaultValue={instance.color}
          />
          <input
            onChange={(e) =>
              changeKeyWords(e.target.checked, parseInt(index), "bold")
            }
            type="checkbox"
            defaultValue={instance.bold}
          />
        </div>
      ))}
      {variableColors.names.map((instance, index) => (
        <div className="optionSet" key={index}>
          <div>{variableColors.titles[index]}</div>
          <input
            onChange={(e) =>
              changeColorPredifined(e.target.value, "color", instance)
            }
            type="color"
            defaultValue={variableColors[instance].color}
          />
          <input
            onChange={(e) =>
              changeColorPredifined(e.target.checked, "bold", instance)
            }
            type="checkbox"
            defaultChecked={variableColors[instance].bold}
          />
        </div>
      ))}
      <div className="optionSet">
        <div>Digits</div>
        <input
          onChange={(e) => changeDigits(e.target.value, "color")}
          type="color"
          defaultValue={digits.color}
        />
        <input
          type="checkbox"
          onChange={(e) => changeDigits(e.target.checked, "bold")}
          defaultValue={digits.bold}
        />
      </div>
      <div className="optionSet">
        <div>Background</div>
        <input
          name="background"
          type="color"
          onChange={changeGlobalOptions}
          defaultValue={globalOptions.background}
        />
      </div>
      <div className="optionSet">
        <div>Base color</div>
        <input
          name="baseColor"
          type="color"
          onChange={changeGlobalOptions}
          defaultValue={globalOptions.baseColor}
        />
      </div>
      <div className="optionSet">
        <div>Padding</div>
        <input
          name="padding"
          type="number"
          onChange={changeGlobalOptions}
          defaultValue={globalOptions.padding}
        />
      </div>
      <div className="optionSet">
        <div>Lineheight</div>
        <input
          name="lineheight"
          type="number"
          onChange={changeGlobalOptions}
          defaultValue={globalOptions.lineheight}
        />
      </div>
      <div className="optionSet">
        <div>Fontsize</div>
        <input
          name="fontsize"
          type="number"
          onChange={changeGlobalOptions}
          defaultValue={globalOptions.fontsize}
        />
      </div>
      <button onClick={savePDF}>Save PDF</button>
    </div>
  );
};

export default Options;
