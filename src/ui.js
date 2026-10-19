import { Store } from './store.js';
import { createSound} from './scene.js';

export function initUI(gameStore, sounds) {
    const { sound1, sound2 } = sounds;
    const resultText = document.getElementById('resultText');
    const checkBtn = document.getElementById('check');
    const unsubscribe = gameStore.subscribe((state) => {
      console.log('state пришёл:', state);   // ← добавить

        const { phase, score, total } = state;

        //подпись
        if(state.phase==='sorting') resultText.innerText = `Расположите все предметы в зонах`;
        if(state.phase==='wrong_sort' || state.phase==='true_sort') resultText.innerText = `Правильно: ${score} из ${total}`;
        //картинка
        if(state.phase==='sorting' || state.phase==='wrong_sort') document.getElementById('result-img').classList.remove('visible');
        if(state.phase==='true_sort') document.getElementById('result-img').classList.add('visible');
        //звук
        if(state.phase==='sorting' || state.phase==='wrong_sort') {
        sound1.play();
        sound2.pause();
        }
        if(state.phase==='true_sort') {
        sound2.play();
        sound1.pause();
        }
    });
    return { checkBtn, unsubscribe };
}