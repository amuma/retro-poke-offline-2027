/* All records in this prototype are fictional. No personal data is included. */
(() => {
  const formats = [
    { id: 'gsc', name: '一撃なし金銀', short: 'GSC', color: '#d6be70', pool: ['カビゴン','サンダー','パルシェン','ゲンガー','スイクン','ガラガラ','ナッシー','ライコウ','カイリキー','ブラッキー','ハガネール','ヘラクロス'] },
    { id: 'late', name: '後期シングル', short: 'LATE SINGLE', color: '#b993e8', pool: ['メタグロス','ボーマンダ','ラティオス','スイクン','サンダー','カビゴン','ゲンガー','ヘラクロス','ミロカロス','ラグラージ','ハピナス','バンギラス'] },
    { id: 'gs', name: '4thGS', short: '4TH GS', color: '#8bb9d7', pool: ['カイオーガ','ディアルガ','ルンパッパ','メタグロス','パルキア','グラードン','ユキノオー','ギラティナ','クレセリア','カポエラー','ドーブル','ホウオウ'] },
    { id: 'bw', name: 'BW2シングル', short: 'BW2', color: '#9fceae', pool: ['バンギラス','ガブリアス','クレセリア','ヒードラン','ローブシン','ボルトロス','ラティオス','ハッサム','キノガッサ','スイクン','カイリュー','ウルガモス'] }
  ];
  const pokemonIds = Object.freeze({
    'カビゴン': 143, 'サンダー': 145, 'パルシェン': 91, 'ゲンガー': 94,
    'スイクン': 245, 'ガラガラ': 105, 'ナッシー': 103, 'ライコウ': 243,
    'カイリキー': 68, 'ブラッキー': 197, 'ハガネール': 208, 'ヘラクロス': 214,
    'メタグロス': 376, 'ボーマンダ': 373, 'ラティオス': 381, 'ミロカロス': 350,
    'ラグラージ': 260, 'ハピナス': 242, 'バンギラス': 248, 'カイオーガ': 382,
    'ディアルガ': 483, 'ルンパッパ': 272, 'パルキア': 484, 'グラードン': 383,
    'ユキノオー': 460, 'ギラティナ': 487, 'クレセリア': 488, 'カポエラー': 237,
    'ドーブル': 235, 'ホウオウ': 250, 'ガブリアス': 445, 'ヒードラン': 485,
    'ローブシン': 534, 'ボルトロス': 642, 'ハッサム': 212, 'キノガッサ': 286,
    'カイリュー': 149, 'ウルガモス': 637
  });
  const events = [
    { id: 'tokyo-03', name: '東京レトロオフ #03', city: 'TOKYO', place: '東京都内・サンプル会場', date: '2027.03.21', iso: '2027-03-21', count: 96, host: '東京レトロオフ運営（架空）', edition: '03', seed: 3 },
    { id: 'osaka-02', name: '関西レトロオフ #02', city: 'OSAKA', place: '大阪府内・サンプル会場', date: '2027.02.21', iso: '2027-02-21', count: 32, host: '関西レトロオフ運営（架空）', edition: '02', seed: 2 },
    { id: 'tokyo-01', name: '東京レトロオフ #01', city: 'TOKYO', place: '東京都内・サンプル会場', date: '2027.01.24', iso: '2027-01-24', count: 64, host: '東京レトロオフ運営（架空）', edition: '01', seed: 1 }
  ];
  // Replace sample names/icons and set url to publish each external link card.
  const meetupLinks = [
    {
      type: 'youtube', organizer: '東京レトロオフ', title: '東京レトロオフ チャンネル',
      description: '各世代の対戦配信や決勝戦アーカイブを紹介するチャンネルの掲載イメージです。',
      icon: 'assets/channels/tokyo-sample.svg', url: null
    },
    {
      type: 'youtube', organizer: '関西レトロオフ', title: '関西レトロオフ チャンネル',
      description: 'オフ会の対戦動画やイベントの様子を届けるチャンネルの掲載イメージです。',
      icon: 'assets/channels/kansai-sample.svg', url: null
    },
    {
      type: 'blog', organizer: '東京レトロオフ', title: '東京レトロオフ 開催レポート',
      description: '当日の様子や対戦の振り返りをまとめた、主催者ブログ記事の掲載イメージです。',
      url: null
    },
    {
      type: 'blog', organizer: '関西レトロオフ', title: '関西レトロオフ 参加ガイド',
      description: '会場案内や持ち物、初めて参加する方向けのブログ記事の掲載イメージです。',
      url: null
    }
  ];
  const names = ['アオイ','くろねこ','ハル','ミナト','あずき','ソラ','ナギ','ユウ','カエデ','シオン','ライム','モカ','フウ','れん','ヒナタ','つばさ','コハク','マシロ','リク','いと','ツキ','セナ','スミレ','サク'];
  const players = Array.from({ length: 96 }, (_, i) => ({ id: `p${String(i + 1).padStart(3, '0')}`, name: names[i] || `サンプル選手${String(i + 1).padStart(2, '0')}` }));
  const basePoints = rank => rank === 1 ? 100 : rank === 2 ? 75 : rank === 3 ? 60 : rank === 4 ? 50 : rank <= 8 ? 30 : rank <= 16 ? 15 : rank <= 32 ? 5 : 0;
  const scale = count => count >= 96 ? { name: 'S', rate: 1.5 } : count >= 64 ? { name: 'A', rate: 1.25 } : count >= 32 ? { name: 'B', rate: 1 } : { name: 'C', rate: .75 };
  const points = (rank, count) => Math.floor(basePoints(rank) * scale(count).rate);
  const results = [];
  events.forEach(event => formats.forEach((format, f) => {
    const roster = players.slice(0, event.count).map((player, i) => ({ player, weight: (i * 37 + event.seed * 17 + f * 23) % event.count })).sort((a, b) => a.weight - b.weight || a.player.id.localeCompare(b.player.id));
    roster.forEach(({ player }, i) => {
      const party = format.pool.map((name, j) => ({ name, key: ((i + 1) * (j + 3) * 7 + event.seed * 11 + f * 13 + j * j * 3) % 101 })).sort((a,b) => a.key - b.key).slice(0,6).map(x => x.name);
      results.push({ eventId: event.id, formatId: format.id, playerId: player.id, rank: i + 1, points: points(i + 1, event.count), party });
    });
  }));
  function ranking(formatId = 'all') {
    const rows = players.map(player => {
      const entries = results.filter(r => r.playerId === player.id && (formatId === 'all' || r.formatId === formatId));
      return { ...player, entries, points: entries.reduce((sum, r) => sum + r.points, 0), events: new Set(entries.map(r => r.eventId)).size, wins: entries.filter(r => r.rank === 1).length, podiums: entries.filter(r => r.rank <= 3).length };
    }).filter(p => p.entries.length).sort((a,b) => b.points - a.points || b.wins - a.wins || b.podiums - a.podiums || a.id.localeCompare(b.id));
    rows.forEach((row, i) => { const previous = rows[i - 1]; row.rank = previous && previous.points === row.points && previous.wins === row.wins && previous.podiums === row.podiums ? previous.rank : i + 1; });
    return rows;
  }
  function kp(eventId, formatId) {
    const entries = results.filter(r => r.eventId === eventId && r.formatId === formatId);
    const counts = new Map();
    entries.forEach(r => r.party.forEach(name => counts.set(name, (counts.get(name) || 0) + 1)));
    return [...counts].map(([name, count]) => ({ name, count, percent: count / entries.length * 100 })).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name, 'ja'));
  }
  window.RPO = { formats, pokemonIds, events, meetupLinks, players, results, basePoints, scale, points, ranking, kp };
})();
