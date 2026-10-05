/* =========================================================
   Icons コンポーネント
   線画アイコン（24x24 / stroke）を名前で返す
   使い方: Hinan.icon('house', 'w-6 h-6')
   ========================================================= */
window.Hinan = window.Hinan || {};

(function (H) {
  const P = {
    megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    houseBroken: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5l1-3-2-2 2-3"/><path d="M19 10v10h-6"/><path d="m14 9 1 3-2 2"/>',
    shelter: '<path d="M2 21h20"/><path d="M4 21V10l8-5 8 5v11"/><path d="M12 5V2l3 1-3 1"/><path d="M9 21v-5h6v5"/><path d="M7.5 12h2M14.5 12h2"/>',
    car: '<path d="M4 16V12l2-5h12l2 5v4"/><path d="M3 16h18v2H3z"/><circle cx="7.5" cy="18.5" r="1.8"/><circle cx="16.5" cy="18.5" r="1.8"/><path d="M6.5 12h11"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    plug: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0Z"/><path d="M12 17v4"/>',
    flag: '<path d="M5 21V3"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    droplet: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
    food: '<path d="M3 12h18"/><path d="M4 12a8 8 0 0 0 16 0"/><path d="M9 8c0-2 1.5-2 1.5-4M13.5 8c0-2 1.5-2 1.5-4"/>',
    backpack: '<path d="M6 9a6 6 0 0 1 12 0v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z"/><path d="M9 4.5V3h6v1.5"/><path d="M9 14h6v4H9z"/>',
    building: '<path d="M4 21V5l8-2v18"/><path d="M12 9h8v12"/><path d="M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
    paw: '<circle cx="7" cy="10" r="1.8"/><circle cx="17" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><path d="M12 12c-3 0-5 4-5 6s2 2.5 5 1.5c3 1 5 .5 5-1.5s-2-6-5-6Z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 10V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.5-2l-2.6-3.2a1.5 1.5 0 0 1 2.3-2L8 16"/>',
    partition: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z"/>',
    toilet: '<path d="M6 3h5v7H6z"/><path d="M4 10h15a0 0 0 0 1 0 0 7 7 0 0 1-7 7h-2a6 6 0 0 1-6-6Z"/><path d="M9 17l-1 4h7l-1-4"/>',
    fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h12"/><path d="M6.5 8h5"/><path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
    route: '<circle cx="6" cy="19" r="2"/><path d="M18 9a3 3 0 1 0-3-3c0 2.2 3 5 3 5s3-2.8 3-5"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h3"/>',
    alert: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    flame: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-1.5 2-2 3.5-2 5-1-1-2-1.5-2-3-2 2-4 4.5-4 8a6 6 0 0 0 6 6Z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
    radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="m7 8 9-5"/><circle cx="15.5" cy="14" r="2.5"/><path d="M6.5 12.5h3M6.5 15.5h3"/>',
    thermo: '<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/><path d="M18 6h2M18 10h2"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="m3 7.5 9 4.5 9-4.5"/><path d="M12 12v9"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h3M20 17v4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5h.01"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 21v-5h-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  };

  H.icon = function (name, cls = 'w-5 h-5') {
    const body = P[name] || P.info;
    return `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  };

  /* 問題文のキーワードからアイコンを推定 */
  H.iconForProblem = function (q) {
    const map = [
      ['安否', 'phone'], ['二次被害', 'plug'], ['知らせる', 'flag'], ['水・食料', 'droplet'],
      ['持ち出し', 'backpack'], ['満員', 'building'], ['ペット', 'paw'], ['衛生', 'hand'],
      ['プライバシー', 'partition'], ['トイレ', 'toilet'], ['配給', 'megaphone'], ['燃料', 'fuel'],
      ['困難', 'route'], ['リスク', 'alert'],
    ];
    const hit = map.find(([k]) => q.includes(k));
    return hit ? hit[1] : 'info';
  };
})(window.Hinan);
