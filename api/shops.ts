import type { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';

interface ShopResult {
  results: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shop: any[];
  };
}

export default async (request: IncomingMessage, response: ServerResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const req = request as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = response as any;

  const apiKey = process.env.HOTPEPPER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  // req.headers.host が undefined の場合の対策
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url || '', `http://${host}`);

  // パラメータ取得
  const keyword = url.searchParams.get('keyword');
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const genre = url.searchParams.get('genre');
  const range = url.searchParams.get('range') || '3';
  const count = url.searchParams.get('count') || '20';

  // 条件チェック
  if (!keyword && !genre && (!lat || !lng)) {
    return res.status(400).json({ error: 'Search condition is required' });
  }

  const params = new URLSearchParams({
    key: apiKey,
    count: count,
    format: 'json',
  });

  if (keyword) params.append('keyword', keyword);
  if (genre) params.append('genre', genre);
  if (lat && lng) {
    params.append('lat', lat);
    params.append('lng', lng);
    params.append('range', range);
  }

  const HOTPEPPER_API_URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/';
  const fullUrl = `${HOTPEPPER_API_URL}?${params.toString()}`;

  try {
    const apiResponse = await fetch(fullUrl);
    
    // エラーハンドリング: レスポンスがOKでない場合
    if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.statusText}`);
    }

    const data: ShopResult = await apiResponse.json() as ShopResult;

    // データ変換処理
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shops = data.results?.shop?.map((shop: any) => ({
      id: shop.id,
      name: shop.name,
      url: shop.urls.pc,
      photoUrl: shop.photo.pc.l,
      genre: shop.genre.name,
      address: shop.address,
      lat: shop.lat,
      lng: shop.lng
    })) || [];

    return res.status(200).json({ shops });
  } catch (_error) {
    // _error とすることで「使っていない変数」エラーを回避
    console.error(_error); // 必要に応じてログ出力
    return res.status(500).json({ error: 'Internal server error' });
  }
};