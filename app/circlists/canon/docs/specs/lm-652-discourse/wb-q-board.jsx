// Four whiteboards — mount. Order is the prompt's: the mark, sending, leaving
// the writing face, the name. Nothing carries between them.
const WbPage = () => (
  <React.Fragment>
    <WbHead />
    <WbBoardMark />
    <WbBoardSend />
    <WbBoardLeave />
    <WbBoardName />
    <footer className="wb-foot"><div className="wb-wrap">lm-652 · four open questions · nothing here is ratified</div></footer>
  </React.Fragment>
);

ReactDOM.createRoot(document.getElementById('root')).render(<WbPage />);
