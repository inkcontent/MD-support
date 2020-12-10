importScripts('../inkapi.js')

const headingSupportTypes = ["paragraph", "heading-two", "heading-three", "heading-four"]

let allBlocks = [];

INKAPI.ready(() => {
  const Editor = INKAPI.editor;

  const contentChangeHandler = (data = []) => {
    if (data.length !== 1) {
      updateBlocks();
      return;
    };
    const obj = data[0];
    const { text, type, isBlock, path, key } = obj;
    const prevBlockState = getBlockFromKey(key);
    //blockquote check
    if (
      text.slice(0, 2).includes('> ') &&
      headingSupportTypes.includes(type) &&
      isBlock
    ) {
      if (prevBlockState) {
        if (prevBlockState.text.slice(0, 2) !== text.slice(0, 2)) {
          Editor.setBlockData({ type: "quote" }, path);
        }
      } else {
        Editor.setBlockData({ type: "quote" }, path);
      }
      updateBlocks();
      return;
    }

    //headings check
    if (
      text.slice(0, 5).includes('## ') &&
      headingSupportTypes.includes(type) &&
      isBlock
    ) {
      let options = null;
      if (text.slice(0, 3) === "## ") {
        if (prevBlockState) {
          if (prevBlockState.text.slice(0, 3) !== text.slice(0, 3)) {
            options = { type: "heading-two" };
          }
        } else {
          options = { type: "heading-two" };
        }
      } else if (text.slice(0, 4) === "### ") {
        if (prevBlockState) {
          if (prevBlockState.text.slice(0, 4) !== text.slice(0, 4)) {
            options = { type: "heading-three" };
          }
        } else {
          options = { type: "heading-three" };
        }
      } else if (text.slice(0, 5) === "#### ") {
        if (prevBlockState) {
          if (prevBlockState.text.slice(0, 5) !== text.slice(0, 5)) {
            options = { type: "heading-four" };
          }
        } else {
          options = { type: "heading-four" };
        }
      }

      if (options) {
        Editor.setBlockData(options, path);
        updateBlocks();
        return;
      }
    }
    updateBlocks();
  };

  //your code here
  Editor.on(contentChangeHandler, "contentChange")

})

function getBlockFromKey(key) {
  return allBlocks.find(b => b.key === key);
}

function updateBlocks() {
  INKAPI.editor.getAllBlocks()
    .then(blocks => {
      allBlocks = blocks;
    })
}