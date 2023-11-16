import { render, screen, within } from '@testing-library/react';
import Room from '../components/Room';

test('renders room text', () => {
  render(<Room />);
  screen.getByText("Dans quelle salle vous situez vous ?");
});

test('renders room select element', () => {
  render(<Room />);
  const selectElement = screen.getByRole('button');
  expect(selectElement).toBeInTheDocument();
});
