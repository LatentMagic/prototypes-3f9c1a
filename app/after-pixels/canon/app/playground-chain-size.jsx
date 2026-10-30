// ============================================================================
// After Pixels — PLAYGROUND, not canon: Chain's session card sized five ways (1236). Open with ?pg=chain-size.
// Joe on the built page: the board and its letters are enormous while the guesses (the chain of links) are tiny. The board shows
// every word, so it is always five to seven rows high. Each direction keeps the card as built (gs-chain.jsx: Linked rows, Guess 6a's
// finish) and changes only sizes, proportion and placement, through the custom properties in playground-chain-size.css.
// ============================================================================
import React from 'react';
import { GS_SESSION_BODY } from './registry.js';
import { ChnSessBody } from './gs-chain.jsx';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

const ChsBody = ({ s }) => { const dir = usePgSetting('dir'); return <div className={'chs chs-' + dir}><ChnSessBody s={s} /></div>; };

const CHS = { title: 'Chain size', settings: [
  { key: 'dir', label: 'Direction', options: [
    { value: 'rebalance', label: 'A Rebalanced' },
    { value: 'fluid', label: 'B Fluid' },
    { value: 'tied', label: 'C Links as tiles' },
    { value: 'capped', label: 'D Fits the screen' },
    { value: 'matched', label: 'E Chain as long as the board' },
    { value: 'canon', label: 'As built' }] },
  { key: 'play', label: 'Play', options: [
    { value: 'solved', label: 'Solved', state: 'session-chain' },
    { value: 'live', label: 'In progress', state: 'session-chain-in-progress' },
    { value: 'failed', label: 'Failed', state: 'session-chain-failed' },
    { value: 'earlier', label: 'Earlier', state: 'session-chain-earlier' }] }] };

export const initPlaygroundChainSize = () => {
  pgRegister('chain-size', CHS);
  if (pgActive() === CHS) GS_SESSION_BODY.chain = ChsBody;
};
