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

const productImages: Record<string, Record<string, string[]>> = {
  '01': {
    'VOID': Array.from({ length: 5 }, (_, i) => `./resources/tee-01-void-${i + 1}.jpg`),
    'ERROR WHITE': Array.from({ length: 5 }, (_, i) => `./resources/tee-01-white-${i + 1}.jpg`),
    'STATIC BLUE': Array.from({ length: 5 }, (_, i) => `./resources/tee-01-blue-${i + 1}.jpg`),
  },
  '02': {
    'VOID': Array.from({ length: 5 }, (_, i) => `./resources/tee-02-void-${i + 1}.jpg`),
    'ERROR WHITE': Array.from({ length: 5 }, (_, i) => `./resources/tee-02-white-${i + 1}.jpg`),
    'STATIC BLUE': Array.from({ length: 5 }, (_, i) => `./resources/tee-02-blue-${i + 1}.jpg`),
  },
  '03': {
    'ACID LEMON': Array.from({ length: 5 }, (_, i) => `./resources/hoodie-01-lemon-${i + 1}.jpg`),
    'ERROR WHITE': Array.from({ length: 5 }, (_, i) => `./resources/hoodie-01-white-${i + 1}.jpg`),
    'GLITCH PINK': Array.from({ length: 5 }, (_, i) => `./resources/hoodie-01-pink-${i + 1}.jpg`),
  },
};

function photoVisual(product: Product, large = false): string {
  const image = productImages[product.code]?.[product.kind === 'hoodie' ? 'ACID LEMON' : 'VOID']?.[0] || '';
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
  const images = productImages[p.code]?.[selectedColor] || [];
  const shots = images.map((image, i) => `<div class="galleryShot ${galleryIndex === i ? 'active' : ''}"><img class="sheetImg" src="${image}" alt="ABSURD ${p.name} — фото ${i + 1}" /></div>`).join('');
  const count = images.length;
  return `<div class="gallery color-${colorClass(selectedColor)}"><div class="galleryStage">${shots}<button class="galleryArrow galleryPrev" id="galleryPrev" aria-label="Предыдущее фото">←</button><button class="galleryArrow galleryNext" id="galleryNext" aria-label="Следующее фото">→</button><div class="galleryCounter">${count ? galleryIndex + 1 : 0} / ${count}</div></div></div>`;
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
  const handleGalleryKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const target = e.target as HTMLElement | null;
    if (target?.matches('input, textarea, select')) return;
    e.preventDefault();
    const galleryCount = productImages[p.code]?.[selectedColor]?.length || 0;
    galleryIndex = e.key === 'ArrowLeft'
      ? (galleryIndex + galleryCount - 1) % galleryCount
      : (galleryIndex + 1) % galleryCount;
    openProductGallery(p);
  };
  document.addEventListener('keydown', handleGalleryKeydown);
  if (p.kind === 'hoodie' || p.kind === 'tee') {
    const galleryCount = productImages[p.code]?.length || 0;
    document.querySelector('#galleryPrev')?.addEventListener('click', () => { galleryIndex = (galleryIndex + galleryCount - 1) % galleryCount; openProductGallery(p); });
    document.querySelector('#galleryNext')?.addEventListener('click', () => { galleryIndex = galleryCount ? (galleryIndex + 1) % galleryCount : 0; openProductGallery(p); });
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

function openProductGallery(p: Product): void {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.outerHTML = productGallery(p);
  if (p.kind === 'tee') paintTeeGallery(p);
    const galleryCount = productImages[p.code]?.[selectedColor]?.length || 0;
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
