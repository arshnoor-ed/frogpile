                                                                       
                                                                            
                                                                          
                                                                            
                                                          
                                                                              
                                                                             
                                                                      
(function (g) {
  'use strict';
  let padIndex = null, selected = null;
                                                                             
                                                                              
                                                                           
                                                                          
                                                                             
                                                                            
                                                                            
                                                         
  const PICKER_ART = {
    lily: 'assets/flowers/flower-picker/pink-open.webp',
    whitelily: 'assets/flowers/flower-picker/white-open.webp',
    bluelily: 'assets/flowers/flower-picker/blue-open.webp',
    reed: 'assets/flowers/flower-picker/reed-open.webp',
  };
  const SEED_ICON = 'assets/ui2/currency/seed.png';                                                   
  function pickerArt(id) {
    const src = PICKER_ART[id];
    return src ? {src} : {hide:true};
  }
  function open(i) {
    dismissFlowerChooser(); padIndex = i; selected = null;
    const root = document.createElement('div');
    root.id = 'flower-chooser'; root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'Plant a flower');
    root.innerHTML = '<div class="fp-popup__backdrop" onclick="dismissFlowerChooser()"></div>'
      + KitUI.popup({
        id: 'fp-popup', className: 'fp-popup__panel',
        title: 'PLANT A FLOWER', subtitle: 'A bloom buffs the frog for a limited time',
        onClose: 'dismissFlowerChooser()', closeAriaLabel: 'Close plant a flower',
        bodyHTML: '', footerHTML: ' ',
      });
                                                                             
    root.querySelector('.kit-popup__body').classList.add('fp-popup__body');
    root.querySelector('.kit-popup__footer').classList.add('fp-popup__footer');
    root.querySelector('.kit-popup__close').classList.add('fp-popup__close');
    document.body.appendChild(root); refresh();
    root.querySelector('.fp-popup__close').focus({preventScroll:true});
                                                                               
    setTimeout(() => { if(root.isConnected) document.addEventListener('pointerdown', flowerChooserOutside, true); }, 0);
  }
                                                                         
                                                                            
                                                                
  function plantButtonHTML() {
    const have = state.seeds || 0, need = selected ? Flowers.plantCostFor(selected) : 0;
    const short = !!selected && have < need;
    const name = selected ? Flowers.flowerDisplayName(selected) : '';
    return KitUI.button({
      label: !selected ? 'Pick a flower' : short ? 'Need ' + need : 'PLANT ' + need,
      tone: !selected ? 'violet' : short ? 'danger' : 'gold', size:'lg',
      iconSrc: selected ? SEED_ICON : null, shine: !!selected,
      className:'fp-plant-btn kit-popup__cta fp-plant-btn--' + (!selected ? 'pick' : short ? 'short' : 'plant'),
      disabled: !selected || short,
      ariaLabel: !selected ? 'Pick a species first' : short ? 'Not enough seeds — ' + name + ' needs ' + need + ', you have ' + have : 'Plant ' + name + ' for ' + need + ' seeds',
      onclick:'FlowerPickerUI.plant()',
    });
  }
  function refresh() {
    const root = document.getElementById('flower-chooser'); if (!root) return;
    const body = root.querySelector('.fp-popup__body'), scroll = body.scrollTop;
    body.innerHTML = Flowers.chooserHTML(state.seeds || 0, pickerArt, id => "FlowerPickerUI.select('" + id + "')", selected, locked);
    body.scrollTop = scroll;
    root.querySelector('.fp-popup__footer').innerHTML = plantButtonHTML();
  }
                                                                                   
                                                                                      
  function locked(id) { return !Flowers.isFlowerUnlocked(state, id); }
  function select(id) {
    Flowers.flowerBuffSpec(id);
    if (locked(id)) return;
    selected = id; refresh();
    const el = document.querySelector('#flower-chooser .fp-flowerpick__tile--on');
    if(el) el.focus({preventScroll:true});
                                                                       
                                                                             
    const detail = document.querySelector('#flower-chooser .fp-flowerpick__detail');
    if(detail) detail.scrollIntoView({block:'nearest'});
  }
  function plant() {
    if(selected && !locked(selected) && document.getElementById('flower-chooser') && (state.seeds||0) >= Flowers.plantCostFor(selected)) chooseFlower(padIndex, selected);
  }
  function guideTarget() {
    const root = document.getElementById('flower-chooser'); if(!root) return null;
                                                                                                      
    const lily = root.querySelector('.fp-flowerpick__tile[data-flower="lily"][data-affordable="true"]');
    const el = (lily && lily.getAttribute('aria-pressed') !== 'true' ? lily : null)
      || root.querySelector('.fp-plant-btn:not([disabled])') || root.querySelector('.fp-flowerpick__tile[data-affordable="true"]');
    if(el && el.closest('.fp-popup__body')) el.scrollIntoView({block:'nearest'});
    return el;
  }
  document.addEventListener('keydown', e => {
    const root = document.getElementById('flower-chooser'); if(!root) return;
    if(e.key === 'Escape') { dismissFlowerChooser(); e.preventDefault(); }
  });
  g.FlowerPickerUI = {open, select, plant, guideTarget};
})(window);
