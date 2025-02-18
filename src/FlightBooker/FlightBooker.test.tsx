import { render, screen, fireEvent, cleanup} from '@testing-library/react'
import FlightBooker, { Options, getDateISOString } from './FlightBooker';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

const today = new Date()
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1)
const dates = [getDateISOString(today), getDateISOString(tomorrow)]

describe('FlightBooker Component', () => {
  beforeEach(() => {
    render(<FlightBooker />);
  });

  it('renders return option by default', () => {
    const returnOption = screen.getByRole('option', { name: 'Return' });
    expect(returnOption.selected).toBe(true);
  });

  it('shows one date input for one-way and two for return', async () => {
    // switch to one-way
    const optionList = screen.getByRole('combobox', { name: 'Flight options' })
    await userEvent.selectOptions(optionList, [Options.oneWay])
    const oneWayOption = screen.getByRole('option', { name: 'One Way' });
    expect(oneWayOption).toBeVisible()

    // verify date input
    const departureInput = screen.getByLabelText('Departure')
    expect(departureInput).toBeVisible();
    expect(screen.queryByLabelText('Arrive')).not.toBeInTheDocument();

    // switch to return
    await userEvent.selectOptions(optionList, [Options.return])
    expect(departureInput).toBeVisible();
    expect(screen.getByLabelText('Arrive')).toBeVisible();
  });

  it('shows confirmation message when clicking submit button', async () => {
    const departureInput = screen.getByLabelText('Departure')
    const returnInput = screen.getByLabelText('Arrive');

    await userEvent.type(departureInput, dates[0])
    await userEvent.type(returnInput, dates[1])

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton)

    expect(screen.getByText(`You have booked a return flight, departing on ${dates[0]} and returning on ${dates[1]}`))

    const optionList = screen.getByRole('combobox', { name: 'Flight options' })
    await userEvent.selectOptions(optionList, [Options.oneWay])

    await userEvent.type(departureInput, dates[0])

    await userEvent.click(submitButton)

    expect(screen.getByText(`You have booked a one-way flight on ${dates[0]}`)).toBeInTheDocument();
  });

  it('shows error message if a past date is selected', async () => {
    const departureInput = screen.getByLabelText('Departure')
    fireEvent.change(departureInput, { target: { value: '2020-01-01' } });
    await userEvent.type(departureInput, '2020-01-01')

    const msg = `Input '2020-01-01' is earlier than '${dates[0]}'`
    expect(screen.getByText(new RegExp(msg))).toBeVisible();
  });

  it('shows error message if the arrival date is earlier than the departure date', async () => {
    const departureInput = screen.getByLabelText('Departure')
    const returnInput = screen.getByLabelText('Arrive');

    await userEvent.type(departureInput, dates[1])
    await userEvent.type(returnInput, dates[0])

    const msg = `Input '${dates[0]}' is earlier than '${dates[1]}'`
    expect(screen.getByText(new RegExp(msg))).toBeVisible();
  });

  it('shows multiple error messages if both conditions happen at the same time', async () => {
    const departureInput = screen.getByLabelText('Departure')
    const returnInput = screen.getByLabelText('Arrive');

    const pastDate = '2022-11-11'
    await userEvent.type(departureInput, dates[1])
    await userEvent.type(returnInput, pastDate)

    expect(screen.getByText(new RegExp(`Input '${pastDate}' is earlier than '${dates[0]}'`))).toBeVisible();
    expect(screen.getByText(new RegExp(`Input '${pastDate}' is earlier than '${dates[1]}'`))).toBeInTheDocument();
  });
});
