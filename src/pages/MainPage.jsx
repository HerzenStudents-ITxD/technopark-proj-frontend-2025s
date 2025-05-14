import NaviBar from '../components/Navibar';
import CardProj from '../components/CardProj';

export default function MainPage() {
    return (
        <>
            <NaviBar />
            <div style={{marginLeft: '10vw', marginRight: '10vw'}}>
                <CardProj />
            </div>
        </>
    );
}
