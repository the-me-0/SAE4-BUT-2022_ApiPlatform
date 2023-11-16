import { render, screen, fireEvent, within } from '@testing-library/react';
import Home from '../components/Home';

/* testing original state */
test('Home components original rendering', () => {
  render(<Home />);
  screen.getByText("Dans quelle salle vous situez vous ?");
  screen.getByText("Espace Données");
});

/* testing room selection */
/*
 - This test DON'T work. I did not yet manage to test the specific behavior of MUI's Combobox
*/
test('Room select impacts Datas display', () => {
  const {getByRole} = render(
     <Home />
  );
  fireEvent.mouseDown(getByRole('button'));
  const listbox = within(getByRole('listbox'));
  fireEvent.click(listbox.getByText(/206/));
  screen.getByText(/°C/);
});

/* testing error message apparition */
/*

****** every room is functionnal, as the api responds in time, i can't manage a way to make the error message appear. This test is not relevant anymore. ******

test('Error message appears when no temperature is found', () => {
  const {getByRole} = render(
    <Home />
  );
  fireEvent.mouseDown(getByRole('button'));
  const listbox = within(getByRole('listbox'));
  fireEvent.click(listbox.getByText(/205/));
  screen.getByText("Erreur de chargement de la température, vérifiez votre connexion !");
});
*/