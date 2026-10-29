import { useEffect, useState } from 'react';

import { RECORD_URL, parseRecord } from '../../lib/record';

export default function useRecord() {
    const [state, setState] = useState({ status: 'loading', record: null });

    useEffect(() => {
        const controller = new AbortController();

        fetch(RECORD_URL, { signal: controller.signal, cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) throw new Error(`Record request failed with ${response.status}`);
                return response.json();
            })
            .then((raw) => setState({ status: 'ready', record: parseRecord(raw) }))
            .catch((error) => {
                if (error.name !== 'AbortError') setState({ status: 'error', record: null });
            });

        return () => controller.abort();
    }, []);

    return state;
}
