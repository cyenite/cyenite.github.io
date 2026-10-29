import Meta from '../components/SEO/Meta';
import ActivityRecord from '../components/activity/ActivityRecord';

export default function Activity() {
    return (
        <>
            <Meta
                path="activity/"
                title="Activity · Aaron Rono"
                description="Daily GitHub contributions for Aaron Rono (cyenite), drawn as a candlestick chart with every new public repository marked."
            />
            <ActivityRecord />
        </>
    );
}
