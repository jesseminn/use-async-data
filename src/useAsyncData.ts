type Info<T = any> = {
    state: 'pending' | 'resolved' | 'error';
    data: Maybe<T>;
    error: Maybe<Error>;
    promise: Promise<Maybe<T>>;
};
type AsyncFunction<T> = () => Promise<T>;
type Maybe<T> = T | null | undefined;

/**
    Interestingly, you cannot use any React hook, such as `useRef`, `useMemo`, or `useCallback`
    , to memoize, because the host component will be cleared before mounted (because you throw)
    the host component won't even mount, thus `useEffect` won't run.
 */
const map = new Map<string, Info>();
// TODO: try remove id from params
export const useAsyncData = <T>(asyncFn: AsyncFunction<T>, id: string) => {
    const info = map.get(id) as Info<T>;
    if (!info) {
        const info: Info<T> = {
            state: 'pending',
            data: null,
            error: null,
            promise: asyncFn()
                .then(v => {
                    console.log('promise.then');
                    info.state = 'resolved';
                    info.data = v;
                    return v;
                })
                .catch(err => {
                    info.state = 'error';
                    info.error = err;
                    return null;
                }),
        };
        map.set(id, info);
        throw info.promise;
    } else {
        switch (info.state) {
            case 'pending':
                break;
            case 'resolved':
                map.delete(id);
                return info.data;
            case 'error':
                throw info.error;
            default:
        }
    }
};
