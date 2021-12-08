import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory, NavLink } from 'react-router-dom';
import usePromise from 'react-use-promise';
import { DayMap, importDays } from './utils';

interface HeaderProps {
  visibleDays: number[]
}

export function Header({ visibleDays }: HeaderProps) {
  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <Link
        to="/"
        className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        <strong>AoC</strong>
      </Link>

      <ul className="nav nav-pills col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        {visibleDays.map(n => <li><NavLink to={`/day/${n}`} activeClassName="nav-link px-2 link-dark active" className="nav-link px-2 link-dark">Day {n}</NavLink></li>)}
      </ul>
      <div className="col-md-3 text-end">
      </div>
    </header>
  );
}

export interface DayProps {
  days: DayMap
}

export function Day({ days }: DayProps) {
  const history = useHistory();
  const params = useParams<{ n?: string }>();
  const latest = Math.max(...Array.from(days.keys()));
  const n = params.n ? parseInt(params.n) : latest;
  const day = days.get(n);
  if (day === undefined) {
    history.push("/");
    return null;
  }
  const result = day();
  const Part1 = () => typeof result.part1 === "string" ? <p> result.part1</p> : result.part1;
  const Part2 = () => typeof result.part2 === "string" ? <p> result.part1</p> : result.part2;
  return (
    <div>
      <div>Part 1: <Part1 /></div>
      <div>Part 2: <Part2 /></div>
    </div>
  );
}

function App() {
  const [days, , state] = usePromise(importDays, []);

  if (state === 'pending') {
    return <Loader type="Hearts" color="#00BFFF" height={80} width={80} />;
  }
  if (state === 'rejected') {
    return <p>"Error!"</p>;
  }
  return (
    <Router>
      <div className="container">
        <Header visibleDays={Array.from(days!.keys())} />
        <Switch>
          <Route path="/day/:n">
            <Day days={days!} />
          </Route>
          <Route path="/">
            <Day days={days!} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
