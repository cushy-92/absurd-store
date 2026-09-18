import './styles.css';

type Product = {
  name: string;
  price: number;
  description: string;
  stock: number;
  code: string;
  kind: 'tee' | 'hoodie';
};
type CartItem = Product & { size: string; color: string; quantity: number };

const products: Product[] = [
  {
    name: 'ASYMMETRIC TEE',
    price: 4900,
    description: 'Оверсайз-футболка из плотного хлопка. Главная деталь — намеренно асимметричный рукав.',
    stock: 7,
    code: '01',
    kind: 'tee',
  },
  {
    name: 'WRONG TEE',
    price: 4500,
    description: 'Оверсайз-футболка из плотного хлопка со смещённой деталью конструкции.',
    stock: 4,
    code: '02',
    kind: 'tee',
  },
  {
    name: 'ASYMMETRIC HOODIE',
    price: 8900,
    description: 'Объёмное худи с асимметричным воротником. Свободный крой и намеренное отклонение от идеальной симметрии.',
    stock: 6,
    code: '03',
    kind: 'hoodie',
  },
];
let cart: CartItem[] = [];
let active = -1;
let selectedSize = '';
let selectedColor = '';
let selectedQuantity = 1;
let galleryIndex = 0;

const app = document.querySelector<HTMLDivElement>('#app')!;

function photoVisual(product: Product, large = false): string {
  const image = product.code === '01' ? './resources/asymmetric-tee-sheet.png' : product.code === '02' ? './resources/wrong-tee-sheet.png' : './resources/asymmetric-hoodie-sheet.png';
  const className = product.kind === 'hoodie' ? 'hoodieFrontPhoto' : 'teeFrontPhoto';
  return `<div class="photoVisual ${large ? 'large' : ''} ${className}" role="img" aria-label="ABSURD ${product.name}"><img src="${image}" alt="ABSURD ${product.name}" /></div>`;
}

function visual(product: Product, large = false): string {
  const hoodie = product.kind === 'hoodie';
  const garment = hoodie
    ? '<path d="M190 170 L250 115 L350 115 L410 170 L505 245 L445 335 L395 290 L395 625 L205 625 L205 290 L155 335 L95 245 Z" fill="#242424"/><path d="M248 115 Q275 175 350 115 L382 145 Q325 205 248 145 Z" fill="#171717"/><path d="M205 290 L155 335 M395 290 L445 335" stroke="#0b0b0b" stroke-width="8"/><path d="M230 440 Q300 425 370 440" fill="none" stroke="#111" stroke-width="5"/><rect x="250" y="462" width="100" height="105" rx="5" fill="#202020" stroke="#111" stroke-width="5"/>'
    : '<path d="M190 145 L250 105 L350 105 L410 145 L505 235 L445 315 L400 275 L400 610 L200 610 L200 275 L155 315 L95 235 Z" fill="#e9e9e9"/><path d="M250 105 Q300 155 350 105" fill="none" stroke="#111" stroke-width="12"/><path d="M200 275 L155 315 M400 275 L445 315" stroke="#111" stroke-width="7"/>';
  const ink = hoodie ? '#eee' : '#111';
  const subInk = hoodie ? '#aaa' : '#555';
  return `<div class="visual ${large ? 'large' : ''} ${hoodie ? 'hoodieVisual' : ''}"><svg viewBox="0 0 600 720" role="img" aria-label="ABSURD ${product.name}"><defs><linearGradient id="fabric${product.code}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hoodie ? '#333' : '#fff'}"/><stop offset=".5" stop-color="${hoodie ? '#181818' : '#d8d8d8'}"/><stop offset="1" stop-color="${hoodie ? '#0e0e0e' : '#f4f4f4'}"/></linearGradient></defs><rect width="600" height="720" fill="#0d0d0d"/><rect x="38" y="38" width="524" height="644" fill="url(#fabric${product.code})" opacity=".12"/>${garment.replace(hoodie ? 'fill="#242424"' : 'fill="#e9e9e9"', `fill="url(#fabric${product.code})"`)}<text x="300" y="390" text-anchor="middle" fill="${ink}" font-family="Arial" font-size="30" font-weight="700" letter-spacing="3">ABSURD</text><text x="300" y="425" text-anchor="middle" fill="${subInk}" font-family="Arial" font-size="13" letter-spacing="5">${product.code} / DROP 001</text></svg></div>`;
}

function render(): void {
  app.innerHTML = `<header><a class="logoMark" href="#" aria-label="absurd"><img src="./favicon.svg" alt="absurd" /></a><button id="cartBtn">КОРЗИНА <span>${cart.reduce((sum, x) => sum + x.quantity, 0)}</span></button></header><main><section class="hero"><small>DROP 001</small><h1>absurd</h1><p>INTENTIONAL IMPERFECTION</p></section><section class="catalog">${products.map((p, i) => `<article class="card" data-i="${i}" tabindex="0">${photoVisual(p)}<div class="meta"><h2>${p.name}</h2><span>${p.price.toLocaleString('ru-RU')} ₽</span></div></article>`).join('')}</section></main><footer><button id="sizeChartBtn" class="sizeChartTrigger">ТАБЛИЦА РАЗМЕРОВ</button><span>absurd © DROP 001</span><a class="telegramLink" href="https://t.me/abbsurdds" target="_blank" rel="noopener noreferrer">tg-absurd</a><a class="supportEmail" href="mailto:andrejtatarincev449@gmail.com">поддержка — andrejtatarincev449@gmail.com</a></footer><div id="sizeChartModal"></div><div id="modal"></div><aside id="drawer"><div class="drawerHead"><b>КОРЗИНА</b><button id="closeCart">×</button></div><div class="cartList">${cart.length ? cart.map((x, i) => `<div class="cartItem"><div><b>${x.name}</b><small>${x.color} · ${x.size}</small><div class="cartQty"><button class="cartMinus" data-cart="${i}">−</button><span>${x.quantity}</span><button class="cartPlus" data-cart="${i}">+</button></div></div><span>${(x.price * x.quantity).toLocaleString('ru-RU')} ₽</span></div>`).join('') : '<p>Корзина пуста</p>'}</div><button id="pay">ОПЛАТИТЬ</button></aside>`;
  document.querySelectorAll<HTMLElement>('.card').forEach(card => {
    const open = () => openProduct(Number(card.dataset.i));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') open();
    });
  });
  document.querySelector('#cartBtn')?.addEventListener('click', () => document.querySelector('#drawer')?.classList.add('open'));
  document.querySelector('#closeCart')?.addEventListener('click', () => document.querySelector('#drawer')?.classList.remove('open'));
  document.querySelectorAll<HTMLButtonElement>('.cartMinus').forEach(button => button.addEventListener('click', () => {
    const i = Number(button.dataset.cart);
    if (cart[i]) {
      if (cart[i].quantity <= 1) {
        cart.splice(i, 1);
      } else {
        cart[i].quantity -= 1;
      }
      render();
      document.querySelector('#drawer')?.classList.add('open');
    }
  }));
  document.querySelectorAll<HTMLButtonElement>('.cartPlus').forEach(button => button.addEventListener('click', () => {
    const i = Number(button.dataset.cart);
    if (cart[i]) {
      cart[i].quantity = Math.min(cart[i].stock, cart[i].quantity + 1);
      render();
      document.querySelector('#drawer')?.classList.add('open');
    }
  }));
  document.querySelector('#pay')?.addEventListener('click', () => alert(cart.length ? 'Это демонстрационная кнопка оплаты. Реальную оплату можно подключить следующим шагом.' : 'Корзина пуста'));
  document.querySelector('#sizeChartBtn')?.addEventListener('click', openSizeChart);
}

function colorClass(color: string): string {
  if (color === 'ERROR WHITE') return 'white';
  if (color === 'GLITCH PINK') return 'pink';
  if (color === 'STATIC BLUE') return 'blue';
  if (color === 'ACID LEMON') return 'lemon';
  return 'black';
}

const teeCropBoxes: Record<string, Array<[number, number, number, number]>> = {
  '01': [[0, 0, 499, 676], [499, 0, 913, 676], [913, 0, 1254, 676], [35, 706, 326, 1045], [630, 706, 910, 1045], [922, 706, 1215, 1045]],
  '02': [[0, 0, 496, 585], [496, 0, 925, 585], [925, 0, 1312, 585], [26, 606, 289, 840], [544, 606, 774, 840], [785, 606, 1015, 840], [1027, 606, 1280, 840]],
};

const tee01VariantCropBoxes: Array<[number, number, number, number]> = [
  [0, 0, 0.372, 0.471],
  [0.373, 0, 0.744, 0.471],
  [0.752, 0, 1, 0.471],
  [0.033, 0.495, 0.258, 0.773],
  [0.510, 0.495, 0.736, 0.773],
  [0.746, 0.495, 0.970, 0.773],
];

const tee02VariantCropBoxes: Array<[number, number, number, number]> = [
  [0, 0, 0.372, 0.491],
  [0.373, 0, 0.752, 0.491],
  [0.758, 0, 1, 0.491],
  [0.034, 0.510, 0.258, 0.716],
  [0.272, 0.510, 0.498, 0.716],
  [0.510, 0.510, 0.736, 0.716],
  [0.748, 0.510, 0.974, 0.716],
];

function productGallery(p: Product): string {
  if (p.kind === 'tee') {
    const count = teeCropBoxes[p.code].length;
    const shots = teeCropBoxes[p.code].map((_, i) => `<div class="galleryShot teeCanvasShot ${galleryIndex === i ? 'active' : ''}"><canvas class="teeCanvas" data-tee="${p.code}" data-view="${i}" aria-label="ABSURD ${p.name} — фото ${i + 1}"></canvas></div>`).join('');
    return `<div class="gallery teeGallery color-${colorClass(selectedColor)}"><div class="galleryStage">${shots}<button class="galleryArrow galleryPrev" id="galleryPrev" aria-label="Предыдущее фото">←</button><button class="galleryArrow galleryNext" id="galleryNext" aria-label="Следующее фото">→</button><div class="galleryCounter">${galleryIndex + 1} / ${count}</div></div></div>`;
  }
  const sourceIndexes = [0, 1, 2, 3, 5, 6, 7];
  const image = './resources/asymmetric-hoodie-sheet.png';
  const shots = sourceIndexes.map((sourceIndex, i) => `<div class="galleryShot hoodieSheetShot hoodieView${sourceIndex} ${galleryIndex === i ? 'active' : ''}"><img class="sheetImg" src="${image}" alt="ABSURD ${p.name} — фото ${i + 1}" /></div>`).join('');
  return `<div class="gallery hoodieGallery color-${colorClass(selectedColor)}"><div class="galleryStage">${shots}<button class="galleryArrow galleryPrev" id="galleryPrev" aria-label="Предыдущее фото">←</button><button class="galleryArrow galleryNext" id="galleryNext" aria-label="Следующее фото">→</button><div class="galleryCounter">${galleryIndex + 1} / ${sourceIndexes.length}</div></div></div>`;
}

function openProduct(index: number): void {
  active = index;
  selectedSize = '';
  selectedQuantity = 1;
  galleryIndex = 0;
  const p = products[index];
  const colors = p.kind === 'hoodie' ? ['ACID LEMON', 'ERROR WHITE', 'GLITCH PINK'] : ['VOID', 'ERROR WHITE', 'STATIC BLUE'];
  selectedColor = p.kind === 'hoodie' ? 'ACID LEMON' : 'VOID';
  document.querySelector<HTMLDivElement>('#modal')!.innerHTML = `<div class="backdrop" id="backdrop"><section class="modal"><button class="close" id="close">×</button>${productGallery(p)}<div class="info"><small>DROP 001</small><h2>${p.name}</h2><div class="price">${p.price.toLocaleString('ru-RU')} ₽</div><div class="stock">Осталось: ${p.stock} шт.</div><div class="optionLabel">ЦВЕТ</div><div class="colors">${colors.map(c => `<button class="color ${selectedColor === c ? 'selected' : ''}" data-color="${c}">${c}</button>`).join('')}</div><div class="optionLabel">РАЗМЕР</div><div class="sizes">${['S', 'M', 'L', 'XL'].map(s => `<button class="size" data-size="${s}">${s}</button>`).join('')}</div><div class="optionLabel">КОЛИЧЕСТВО</div><div class="quantity"><button id="qtyMinus">−</button><span id="qtyValue">1</span><button id="qtyPlus">+</button></div><button class="add" id="add">В КОРЗИНУ</button></div></section></div>`;
  document.body.classList.add('locked');
  document.querySelector('#close')?.addEventListener('click', closeProduct);
  paintTeeGallery(p);
  const handleGalleryKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const target = e.target as HTMLElement | null;
    if (target?.matches('input, textarea, select')) return;
    e.preventDefault();
    const galleryCount = p.kind === 'hoodie' ? 7 : (p.code === '02' ? 7 : 6);
    galleryIndex = e.key === 'ArrowLeft'
      ? (galleryIndex + galleryCount - 1) % galleryCount
      : (galleryIndex + 1) % galleryCount;
    openProductGallery(p);
  };
  document.addEventListener('keydown', handleGalleryKeydown);
  if (p.kind === 'hoodie' || p.kind === 'tee') {
    const galleryCount = p.kind === 'hoodie' ? 7 : (p.code === '02' ? 7 : 6);
    document.querySelector('#galleryPrev')?.addEventListener('click', () => { galleryIndex = (galleryIndex + galleryCount - 1) % galleryCount; openProductGallery(p); });
    document.querySelector('#galleryNext')?.addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % galleryCount; openProductGallery(p); });
    document.querySelectorAll<HTMLButtonElement>('.galleryThumb').forEach(button => button.addEventListener('click', () => { galleryIndex = Number(button.dataset.gallery || 0); openProductGallery(p); }));
  }
  document.querySelector('#backdrop')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeProduct(); });
  document.querySelectorAll<HTMLButtonElement>('.color').forEach(b => b.addEventListener('click', () => { selectedColor = b.dataset.color || ''; document.querySelectorAll('.color').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); const gallery = document.querySelector('.gallery'); if (gallery) { gallery.classList.remove('color-black', 'color-white', 'color-pink', 'color-blue', 'color-lemon'); gallery.classList.add(`color-${colorClass(selectedColor)}`); } if (p.kind === 'tee') paintTeeGallery(p); }));
  document.querySelectorAll<HTMLButtonElement>('.size').forEach(b => b.addEventListener('click', () => { selectedSize = b.dataset.size || ''; document.querySelectorAll('.size').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); }));
  document.querySelector('#qtyMinus')?.addEventListener('click', () => { selectedQuantity = Math.max(1, selectedQuantity - 1); const value = document.querySelector('#qtyValue'); if (value) value.textContent = String(selectedQuantity); });
  document.querySelector('#qtyPlus')?.addEventListener('click', () => { selectedQuantity = Math.min(p.stock, selectedQuantity + 1); const value = document.querySelector('#qtyValue'); if (value) value.textContent = String(selectedQuantity); });
  document.querySelector('#add')?.addEventListener('click', () => {
    if (!selectedColor) { alert('Выберите цвет'); return; }
    if (!selectedSize) { alert('Выберите размер'); return; }
    const product = products[active];
    const existing = cart.find(x => x.code === product.code && x.size === selectedSize && x.color === selectedColor);
    if (existing) existing.quantity = Math.min(product.stock, existing.quantity + selectedQuantity);
    else cart.push({ ...product, size: selectedSize, color: selectedColor, quantity: selectedQuantity });
    closeProduct();
    render();
    document.querySelector('#drawer')?.classList.add('open');
  });
}

function paintTeeGallery(p: Product): void {
  if (p.kind !== 'tee') return;
  const color = colorClass(selectedColor);
  const source = p.code === '01'
    ? (color === 'white' ? './resources/tee-01-white-sheet.jpg' : color === 'blue' ? './resources/tee-01-blue-sheet.jpg' : './resources/asymmetric-tee-sheet.png')
    : (color === 'white' ? './resources/tee-02-white-sheet.jpg' : color === 'blue' ? './resources/tee-02-blue-sheet.jpg' : './resources/wrong-tee-sheet.png');
  const boxes = teeCropBoxes[p.code];
  const isTeeVariant = (p.code === '01' || p.code === '02') && (color === 'white' || color === 'blue');
  const variantBoxes = p.code === '01'
    ? (isTeeVariant ? tee01VariantCropBoxes : null)
    : (isTeeVariant ? tee02VariantCropBoxes : null);
  const canvases = document.querySelectorAll<HTMLCanvasElement>('.teeCanvas');
  const image = new Image();
  image.onload = () => {
    canvases.forEach(canvas => {
      const index = Number(canvas.dataset.view || 0);
      const box = variantBoxes?.[index] || boxes[index];
      if (!box) return;
      const [bx, by, bx2, by2] = box;
      const sx = variantBoxes ? Math.round(bx * image.naturalWidth) : bx;
      const sy = variantBoxes ? Math.round(by * image.naturalHeight) : by;
      const ex = variantBoxes ? Math.round(bx2 * image.naturalWidth) : bx2;
      const ey = variantBoxes ? Math.round(by2 * image.naturalHeight) : by2;
      const sw = ex - sx;
      const sh = ey - sy;
      const renderScale = 2;
      canvas.width = sw * renderScale;
      canvas.height = sh * renderScale;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // The supplied variant sheets have visible sensor/compression grain.
      // A very light pre-upscale blur suppresses only the finest noise while
      // leaving seams, fabric texture, and garment edges readable.
      ctx.filter = isTeeVariant ? 'blur(0.32px)' : 'none';
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw * renderScale, sh * renderScale);
      ctx.filter = 'none';
      if (isTeeVariant) return;
      if (color === 'black') return;
      const frame = ctx.getImageData(0, 0, sw, sh);
      const data = frame.data;
      const gray = new Uint8Array(sw * sh);
      for (let i = 0; i < sw * sh; i += 1) {
        const p = i * 4;
        gray[i] = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);
      }
      let seed = Math.floor(sh * 0.5) * sw + Math.floor(sw * 0.5);
      let best = seed;
      let bestValue = gray[seed];
      for (let y = Math.floor(sh * 0.4); y < Math.floor(sh * 0.62); y += 3) {
        for (let x = Math.floor(sw * 0.4); x < Math.floor(sw * 0.6); x += 3) {
          const idx = y * sw + x;
          if (gray[idx] < bestValue) { bestValue = gray[idx]; best = idx; }
        }
      }
      seed = best;
      const mask = new Uint8Array(sw * sh);
      const stack = [seed];
      while (stack.length) {
        const idx = stack.pop()!;
        if (mask[idx] || gray[idx] >= 105) continue;
        mask[idx] = 1;
        const x = idx % sw;
        const y = Math.floor(idx / sw);
        if (x > 0) stack.push(idx - 1);
        if (x < sw - 1) stack.push(idx + 1);
        if (y > 0) stack.push(idx - sw);
        if (y < sh - 1) stack.push(idx + sw);
      }
      let maskCount = 0;
      for (let i = 0; i < mask.length; i += 1) maskCount += mask[i];
      if (maskCount < sw * sh * 0.08) {
        mask.fill(0);
        const fallbackThreshold = 118;
        for (let i = 0; i < sw * sh; i += 1) {
          if (gray[i] <= fallbackThreshold) mask[i] = 1;
        }
      }
      for (let i = 0; i < sw * sh; i += 1) {
        if (!mask[i]) continue;
        const p = i * 4;
        const g = gray[i];
        if (color === 'white') {
          // Re-map the original black tee's luminance into the requested warm white.
          // Dark source pixels stay as believable fabric shadows; brighter pixels reach
          // the target RGB so folds, highlights, and material texture remain visible.
          const normalized = Math.max(0, Math.min(1, g / 105));
          const factor = 0.54 + Math.pow(normalized, 0.78) * 0.46;
          data[p] = Math.min(255, Math.round(242 * factor));
          data[p + 1] = Math.min(255, Math.round(240 * factor));
          data[p + 2] = Math.min(255, Math.round(234 * factor));
        } else if (color === 'blue') {
          // Use the requested blue as the garment's midtone while preserving the
          // original luminance so folds, shadows, highlights, and fabric texture remain visible.
          const luminance = g / 128;
          const factor = Math.max(0.34, Math.min(1.45, 0.32 + luminance * 0.68));
          data[p] = Math.min(255, Math.round(76 * factor));
          data[p + 1] = Math.min(255, Math.round(81 * factor));
          data[p + 2] = Math.min(255, Math.round(93 * factor));
        }
      }
      ctx.putImageData(frame, 0, 0);
    });
  };
  image.src = source;
}

function openProductGallery(p: Product): void {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.outerHTML = productGallery(p);
  if (p.kind === 'tee') paintTeeGallery(p);
    const galleryCount = p.kind === 'hoodie' ? 7 : (p.code === '02' ? 7 : 6);
  document.querySelector('#galleryPrev')?.addEventListener('click', () => { galleryIndex = galleryCount ? (galleryIndex + galleryCount - 1) % galleryCount : 0; openProductGallery(p); });
  document.querySelector('#galleryNext')?.addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % galleryCount; openProductGallery(p); });
  document.querySelectorAll<HTMLButtonElement>('.galleryThumb').forEach(button => button.addEventListener('click', () => { galleryIndex = Number(button.dataset.gallery || 0); openProductGallery(p); }));
}

function openSizeChart(): void {
  const root = document.querySelector<HTMLDivElement>('#sizeChartModal');
  if (!root) return;
  root.innerHTML = `<div class="sizeChartBackdrop" id="sizeChartBackdrop"><section class="sizeChartWindow" role="dialog" aria-modal="true" aria-labelledby="sizeChartTitle"><button class="sizeChartClose" id="sizeChartClose" aria-label="Закрыть">×</button><small>ABSURD / FIT GUIDE</small><h2 id="sizeChartTitle">ТАБЛИЦА РАЗМЕРОВ</h2><p class="sizeChartNote">Ориентировочные мерки изделия, см.</p><div class="sizeTableWrap"><table class="sizeTable"><thead><tr><th>РАЗМЕР</th><th>ГРУДЬ</th><th>ДЛИНА</th><th>РУКАВ</th></tr></thead><tbody><tr><th>S</th><td>116</td><td>68</td><td>58</td></tr><tr><th>M</th><td>120</td><td>70</td><td>60</td></tr><tr><th>L</th><td>124</td><td>72</td><td>62</td></tr><tr><th>XL</th><td>128</td><td>74</td><td>64</td></tr></tbody></table></div></section></div>`;
  document.querySelector('#sizeChartClose')?.addEventListener('click', closeSizeChart);
  document.querySelector('#sizeChartBackdrop')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeSizeChart(); });
}

function closeSizeChart(): void {
  const root = document.querySelector<HTMLDivElement>('#sizeChartModal');
  if (root) root.innerHTML = '';
}

function closeProduct(): void {
  document.querySelector('#modal')!.innerHTML = '';
  document.body.classList.remove('locked');
  active = -1;
}
render();
