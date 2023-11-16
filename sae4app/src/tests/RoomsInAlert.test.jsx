import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import RoomsInAlert from '../components/RoomsInAlert';
import { ContextProvider } from '../components/GlobalContext';
import { act } from 'react-dom/test-utils';
import { alerts } from '../resources/api-mock';

/*
 * Complex test checking for specific room in list, returned by mocked api
 */
const server = setupServer(
  rest.get('http://localhost:8000/api/rooms/alerts', (req, res, ctx) => {
    return res(ctx.json(
      alerts
    ));
  }),
)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders temperature text', () => {
  render(<ContextProvider><RoomsInAlert /></ContextProvider>);
  screen.getByText("Espace Salles en Alerte");
  screen.getByText("Chargement des alertes...");
});

test('room display accordion shows up and displays correctly', async () => {
  render(<ContextProvider><RoomsInAlert /></ContextProvider>);

  await waitFor(() => screen.getByRole('listitem'));

  expect(screen.getByRole('listitem')).toHaveTextContent(/D206/);
  expect(screen.getByRole('listitem')).toHaveTextContent(/D207/);

  act(() => {
    userEvent.click(screen.getByText(/D206/));
  });
  let accordion = screen.getByRole('button', { expanded: true }).parentElement;
  expect(accordion).toHaveTextContent(/D206/);
  expect(accordion).toHaveTextContent(/15°C/);
  expect(accordion).toHaveTextContent(/en hausse/);
  expect(accordion).toHaveTextContent(/-4°C/);

  act(() => {
    userEvent.click(screen.getByText(/D206/));
    userEvent.click(screen.getByText(/D207/));
  });
  accordion = screen.getByRole('button', { expanded: true }).parentElement;
  expect(accordion).toHaveTextContent(/D207/);
  expect(accordion).toHaveTextContent(/28°C/);
  expect(accordion).toHaveTextContent(/en baisse/);
  expect(accordion).toHaveTextContent(/3°C/);
});

test('accordion displays an advice', async () => {
  render(<ContextProvider><RoomsInAlert /></ContextProvider>);

  await waitFor(() => screen.getByRole('listitem'));

  act(() => {
    userEvent.click(screen.getByText(/D206/));
  });
  let accordion = screen.getByRole('button', { expanded: true }).parentElement;
  expect(accordion).toHaveTextContent(/Il faut fermer les fenêtres et allumer le chauffage pour atteindre une température idéale de 19°C/);
  // test the apparition of a button

  act(() => {
    userEvent.click(screen.getByText(/D206/));
    userEvent.click(screen.getByText(/D207/));
  });
  accordion = screen.getByRole('button', { expanded: true }).parentElement;
  expect(accordion).toHaveTextContent(/Il faut ouvrir les fenêtres pour atteindre une température idéale de 19°C/);
  // test the apparition of a button
});