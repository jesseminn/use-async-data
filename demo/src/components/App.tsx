import React, { Suspense } from 'react';
import { useAsyncData } from 'use-async-data';

const App: React.FC = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Foo />
            </Suspense>
        </div>
    );
};

export default App;

const Foo = () => {
    const data = useAsyncData(async () => {
        return new Promise<{ name: string }>(resolve => {
            setTimeout(() => {
                resolve({ name: 'octocat' });
            }, 2000);
        });
    }, 'foo');

    return <div>{data?.name}</div>;
};
