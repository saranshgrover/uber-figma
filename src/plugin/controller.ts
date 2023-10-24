figma.showUI(__html__, { height: 500, width: 500 });

figma.on('selectionchange', () => {
  const frames = figma.currentPage.selection.map((frame) => ({ name: frame.name, id: frame.id }));
  figma.ui.postMessage({
    type: 'selectionchange',
    frames,
  });
});

figma.ui.onmessage = (msg) => {
  if (msg.type === 'search') {
    const nodes = figma.currentPage.findAll((n) => n.name === msg.query);
    figma.currentPage.selection = nodes;
  }

  if (msg.type === 'reset') {
    figma.currentPage.selection = [];
  }

  if (msg.type === 'rename') {
    const layers: string[] = msg.layers;
    for (const selection of figma.currentPage.selection) {
      if (layers.includes(selection.id)) {
        selection.name = msg.newName;
      }
    }
    const frames = figma.currentPage.selection.map((frame) => ({ name: frame.name, id: frame.id }));
    figma.ui.postMessage({
      type: 'selectionchange',
      frames,
    });
  }
};
