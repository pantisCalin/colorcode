import { useEffect, useRef, useState } from "react";
import ColorCode from "./Components/ColorCode";
import Options from "./Components/Options";
import TextArea from "./Components/TextArea";
import ProcessText from "./Functions/ProcessText";
import { jsPDF } from "jspdf";

function App() {
  const [globalOptions, setGlobalOptions] = useState({
    background: "#FAFAFA",
    padding: 10,
    fontsize: 15,
    lineheight: 20,
    baseColor: "#000000",
  });
  const changeGlobalOptions = (e) => {
    setGlobalOptions({ ...globalOptions, [e.target.name]: e.target.value });
  };
  const [dim, setDim] = useState({ width: 770, height: 563 });
  const resizePannel = (e) => {
    setDim({ ...dim, [e.target.name]: e.target.valueAsNumber });
  };
  const [variableColors, setVariableColors] = useState({
    names: [
      "comments",
      "strings1",
      "strings2",
      "variables1",
      "variables2",
      "function",
    ],
    titles: [
      "Comments after #",
      "StringsBetween ''",
      `StringsBetween ""`,
      "Primary Variables",
      "Arguments",
      "Functions",
    ],
    comments: { color: "#525252", bold: false },
    strings1: { color: "#0014BE", bold: false },
    strings2: { color: "#0014BE", bold: false },
    variables1: { color: "#023342", bold: true },
    variables2: { color: "#525252", bold: false },
    function: { color: "#006EBE", bold: false },
  });
  const changeColorPredifined = (value, type, section) => {
    setVariableColors({
      ...variableColors,
      [section]: {
        ...variableColors[section],
        [type]: value,
      },
    });
  };
  const changeDigits = (value, name) => {
    setDigits({
      ...digits,
      [name]: value,
    });
  };
  const [digits, setDigits] = useState({
    color: "#B80000",
    bold: false,
    words: [
      "-1",
      "-2",
      "-3",
      "-4",
      "-5",
      "-6",
      "-7",
      "-8",
      "-9",
      "-0",
      "1.",
      "2.",
      "3.",
      "4.",
      "5.",
      "6.",
      "7.",
      "8.",
      "9.",
      "0.",
      "1e",
      "2e",
      "3e",
      "4e",
      "5e",
      "6e",
      "7e",
      "8e",
      "9e",
      "0e",
      "e-",
      "e+",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ],
  });
  const [bulkText, setBulkText] = useState(`def Discriminator():
  initializer = tf.random_normal_initializer(0., 0.02)

  inp = tf.keras.layers.Input(shape=[256, 256, 3], name='input_image')
  tar = tf.keras.layers.Input(shape=[256, 256, 3], name='target_image')

  x = tf.keras.layers.concatenate([inp, tar])  # (batch_size, 256, 256, channels*2)

  down1 = downsample(64, 4, False)(x)  # (batch_size, 128, 128, 64)
  down2 = downsample(128, 4)(down1)  # (batch_size, 64, 64, 128)
  down3 = downsample(256, 4)(down2)  # (batch_size, 32, 32, 256)

  zero_pad1 = tf.keras.layers.ZeroPadding2D()(down3)  # (batch_size, 34, 34, 256)
  conv = tf.keras.layers.Conv2D(512, 4, strides=1,
                                kernel_initializer=initializer,
                                use_bias=False)(zero_pad1)  # (batch_size, 31, 31, 512)

  batchnorm1 = tf.keras.layers.BatchNormalization()(conv)

  leaky_relu = tf.keras.layers.LeakyReLU()(batchnorm1)

  zero_pad2 = tf.keras.layers.ZeroPadding2D()(leaky_relu)  # (batch_size, 33, 33, 512)

  last = tf.keras.layers.Conv2D(1, 4, strides=1,
                                kernel_initializer=initializer)(zero_pad2)  # (batch_size, 30, 30, 1)

  return tf.keras.Model(inputs=[inp, tar], outputs=last)`);

  const [isComputing, setIsComputing] = useState(false);
  const [keyWords, setKeyWords] = useState([
    {
      text: "inp, tar",
      color: "#006BBD",
      bold: false,
      words: "inp, tar".split(","),
    },
    {
      text: "return,def,False,True,for,in,import,from, if,else,class",
      color: "#00A347",
      bold: true,
      words: "return,def,False,True,for,in,import,from, if,else,class".split(
        ","
      ),
    },
    {
      text: "tf,tf.,np.,np,layers.,layers,keras.,keras",
      color: "#C24E00",
      bold: false,
      words: "tf.,tf,np.,np,layers.,layers,keras.,keras".split(","),
    },
  ]);
  const [coloredCode, setColoredCode] = useState([
    {
      text: "def NiceFunc():",
      color: "#000dc7",
      colored: true,
    },
    {
      text: "a=1",
      colored: false,
    },
  ]);
  const getTextWritten = (e) => {
    setIsComputing(true);
    setBulkText(e.target.value.toString());
  };

  const changeKeyWords = (value, index, name) => {
    const words =
      name === "text"
        ? value.split(",").filter((element) => element.length > 0)
        : keyWords[index].words;
    setKeyWords([
      ...keyWords.slice(0, index),
      {
        ...keyWords[index],
        [name]: value,
        words: words,
      },
      ...keyWords.slice(index + 1),
    ]);
  };

  useEffect(() => {
    setColoredCode(ProcessText(bulkText, keyWords, digits, variableColors));
    setIsComputing(false);
  }, [digits, bulkText, keyWords, variableColors]);

  const coloredCodeRef = useRef(null);
  const savePDF = () => {
    const content = coloredCodeRef.current;
    const pageType = dim.width > dim.height ? "l" : "p";
    const doc = new jsPDF(pageType, "px", [dim.width, dim.height]);
    doc.html(content, {
      callback: function (doc) {
        var pageCount = doc.internal.getNumberOfPages();
        for (let i = pageCount; i > 1; i--) {
          doc.deletePage(i);
        }
        doc.save("code.pdf");
      },
    });
  };
  return (
    <div className="App">
      <div className="Texts">
        <TextArea getTextWritten={getTextWritten} bulkText={bulkText} />
        <ColorCode
          coloredCode={coloredCode}
          isComputing={isComputing}
          coloredCodeRef={coloredCodeRef}
          dim={dim}
          globalOptions={globalOptions}
        />
      </div>
      <Options
        keyWords={keyWords}
        changeKeyWords={changeKeyWords}
        variableColors={variableColors}
        changeColorPredifined={changeColorPredifined}
        savePDF={savePDF}
        dim={dim}
        resizePannel={resizePannel}
        globalOptions={globalOptions}
        changeGlobalOptions={changeGlobalOptions}
        changeDigits={changeDigits}
        digits={digits}
      />
    </div>
  );
}

export default App;
