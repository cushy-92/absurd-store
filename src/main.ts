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

const photo = (name: string): string => `https://raw.githubusercontent.com/cushy-92/absurd-store/main/${encodeURIComponent(name)}`;

const productImages: Record<string, Record<string, string[]>> = {
  '01': {
    'VOID': [
      photo('черная майка спереди шов.JPG'),
      photo('черная футболка сзади шов.JPG'),
      photo('черный рукав рваный.JPG'),
      photo('черная бирка снаружи.JPG'),
      photo('черная бирка внутри.JPG'),
    ],
    'ERROR WHITE': [
      photo('белая майка спереди шов.JPG'),
      photo('белая шов сзади.JPG'),
      photo('белый рукав рваный.JPG'),
      photo('белая бирка снаружи.JPG'),
      photo('белая бирка внутри.JPG'),
    ],
    'STATIC BLUE': [
      photo('синяя майка спереди шов.JPG'),
      photo('синяя майка сзади щов.JPG'),
      photo('синий рукав.JPG'),
      photo('синяя бирка снаружи.JPG'),
      photo('синяя этикетка.JPG'),
    ],
  },
  '02': {
    'STATIC BLUE': [
      photo('синяя майкарваная спереди.JPG'),
      photo('синяя рваная сзади.JPG'),
      photo('синий рукав.JPG'),
      photo('синяя бирка (2).JPG'),
      photo('синяя этикетка.JPG'),
    ],
    'VOID': [
      photo('черная рваная спереди.JPG'),
      photo('черная майка рванная сзади.JPG'),
      photo('черный рукав рваный.JPG'),
      photo('черная футболка бирка сзади.JPG'),
      photo('черная бирка.JPG'),
    ],
    'ERROR WHITE': [
      photo('белая рваная спереди.JPG'),
      photo('белая рваная сзади.JPG'),
      photo('белый рукав рваный.JPG'),
      photo('белая бирка снаружи (2).JPG'),
      photo('белая бирка.JPG'),
    ],
  },
  '03': {
    'ACID LEMON': [
      photo('желтый худи спереди.JPG'),
      photo('желтый худи сзади.JPG'),
      photo('желтый худи рукав.JPG'),
      photo('желтая бирка снаружи.JPG'),
      photo('желтый бирка внятри.JPG'),
    ],
    'ERROR WHITE': [
      photo('белая худи спереди.JPG'),
      photo('белый хкди сзади.JPG'),
      photo('белый худи рукав.JPG'),
      photo('бирка снаружи белая худи.JPG'),
      photo('белый худи бирка внутри.JPG'),
    ],
    'GLITCH PINK': [
      photo('розовый худи спереди.JPG'),
      photo('розовый худи сзади.JPG'),
      photo('розовый рукав.JPG'),
      photo('розовый худи бирка.JPG'),
      photo('розовыц, бирка внутри.JPG'),
    ],
  },
};

function availableColors(p: Product): string[] {
  return Object.keys(productImages[p.code] || {});
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
  const colors = availableColors(p);
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
  if (productImages[p.code]?.[selectedColor]?.length) {
    const galleryCount = productImages[p.code]?.[selectedColor]?.length || 0;
    document.querySelector('#galleryPrev')?.addEventListener('click', () => { galleryIndex = (galleryIndex + galleryCount - 1) % galleryCount; openProductGallery(p); });
    document.querySelector('#galleryNext')?.addEventListener('click', () => { galleryIndex = galleryCount ? (galleryIndex + 1) % galleryCount : 0; openProductGallery(p); });
    document.querySelectorAll<HTMLButtonElement>('.galleryThumb').forEach(button => button.addEventListener('click', () => { galleryIndex = Number(button.dataset.gallery || 0); openProductGallery(p); }));
  }
  document.querySelector('#backdrop')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeProduct(); });
  document.querySelectorAll<HTMLButtonElement>('.color').forEach(b => b.addEventListener('click', () => { selectedColor = b.dataset.color || ''; galleryIndex = 0; openProductGallery(p); document.querySelectorAll('.color').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); }));
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
  const galleryCount = productImages[p.code]?.[selectedColor]?.length || 0;
  if (!galleryCount) return;
  document.querySelector('#galleryPrev')?.addEventListener('click', () => {
    galleryIndex = (galleryIndex + galleryCount - 1) % galleryCount;
    openProductGallery(p);
  });
  document.querySelector('#galleryNext')?.addEventListener('click', () => {
    galleryIndex = (galleryIndex + 1) % galleryCount;
    openProductGallery(p);
  });
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
render();function photoVisual(product: Product, large = false): string {
  const defaultColor = product.kind === 'hoodie' ? 'ACID LEMON' : 'VOID';
  const image = productImages[product.code]?.[defaultColor]?.[0] || '';
  const className = product.kind === 'hoodie' ? 'hoodieFrontPhoto' : 'teeFrontPhoto';
  return `<div class="photoVisual ${large ? 'large' : ''} ${className}" role="img" aria-label="ABSURD ${product.name}"><img src="${image}" alt="ABSURD ${product.name}" /></div>`;
}

