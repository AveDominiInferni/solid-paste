import "./App.scss";
import LZMA from "lzma-web";
import { createSignal, onMount, Show } from "solid-js";
import { arrayBufferToBase64, base64ToArrayBuffer, checkTheme, invertColors } from "./utils";

const currentOrigin = window.location.origin;

const App = () => {
  const [plaintext, setPlaintext] = createSignal("");
  const [showTextOffer, setShowTextOffer] = createSignal(false);
  const [textOfferValue, setTextOfferValue] = createSignal("");

  onMount(async () => {
    checkTheme()
    const encodedData = location.hash.slice(1);

    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const compressed = base64ToArrayBuffer(decodedData);
        const lzma = new LZMA();
        const decompressed = await lzma.decompress(new Uint8Array(compressed));

        if (typeof decompressed === 'string') {
          setPlaintext(decompressed);
        }
      } catch (error) {
        alert("Failed to decompress data: " + error);
      }
    }
  });

  const generateUrl = async (format: "markdown" | "plain") => {
    try {
      const lzma = new LZMA();
      const compressed = await lzma.compress(plaintext());
      const base64Compressed = arrayBufferToBase64(compressed);
      const encodedCompressed = encodeURIComponent(base64Compressed);

      const url = `${currentOrigin}/#${encodedCompressed}`;

      const result = format === "markdown" ? `[paste](${url})` : url;

      setTextOfferValue(result);
      setShowTextOffer(true);
    } catch (error) {
      alert("Failed to compress data: " + error);
    }
  };

  const copyTextOffer = () => {
    navigator.clipboard.writeText(textOfferValue());
    setShowTextOffer(false);
  };

  return (
    <>
      <textarea
        id="plaintext"
        value={plaintext()}
        onInput={(e) => setPlaintext(e.target.value)}
        spellcheck={false}
      />
      <nav>
        <Show when={!showTextOffer()}>
          <a href="https://github.com/AveDominiInferni/solid-paste" target="_blank">[github]</a>
          <button onClick={() => invertColors()}>[invert colors]</button>
          <button onClick={() => generateUrl("plain")}>[generate url]</button>
          <button onClick={() => generateUrl("markdown")}>[generate markdown link]</button>
        </Show>
        <Show when={showTextOffer()}>
          <input value={textOfferValue()} readonly></input>
          <button onClick={() => copyTextOffer()}>[copy]</button>
          <button onClick={() => setShowTextOffer(false)}>[cancel]</button>
        </Show>
      </nav>
    </>
  );
};

export default App;
