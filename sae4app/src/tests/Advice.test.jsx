import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import Advice from '../components/Advice';
import Button from '@mui/material/Button';


test('render advice title', () => {
  render(<Advice/>);
  expect(screen.getByText("Conseil"));
});

test('render no room selected', () => {
  render(<Advice id={''}/>);
  expect(screen.getByText("Choisissez une salle pour obtenir un conseil"));
});

test('render loading', () => {
  render(<Advice id={1}/>);
  expect(screen.getByText("Chargement du conseil"));
});
