type Listener<T> = (event: T) => void;

export class EventBus {

    private readonly listeners =
        new Map<string, Listener<unknown>[]>();

    on<T>(
        event: string,
        listener: Listener<T>
    ) {

        const list =
            this.listeners.get(event) ?? [];

        list.push(listener as Listener<unknown>);

        this.listeners.set(event, list);

    }

    emit<T>(
        event: string,
        data: T
    ) {

        const list =
            this.listeners.get(event);

        if (!list) {
            return;
        }

        for (const listener of list) {

            (listener as Listener<T>)(data);

        }

    }

}