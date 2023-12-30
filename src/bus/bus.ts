import Game from '../models/game';
import { EventValues } from './events';
import GameBus from './game-bus';
import soundBus from './sound-bus';

class Bus {
    private gameBus: GameBus;
    private soundBus: typeof soundBus;
    private pastEvents: {event: EventValues, data: unknown}[]

    constructor(model: Game) {
        this.gameBus = new GameBus(model);
        this.soundBus = soundBus;
        this.pastEvents = [];
    }

    emit(event: EventValues, data?: unknown) {
        this.gameBus.emit(event, data);
        this.soundBus.emit(event);

        this.pastEvents.push({ event, data });

        console.log(this.pastEvents.slice(Math.max(this.pastEvents.length - 5, 0), this.pastEvents.length))
    }
}

export default Bus;
