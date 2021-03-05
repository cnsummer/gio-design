import React from 'react';
import { mount } from 'enzyme';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import { noop } from 'lodash';
import { clickInput, clickSelectItem, matchValue, matchAll, escapeSelected } from './util';
import Picker from '../index';
import Select from '../Select';
import TimePicker from '../TimePicker';

const options = [0, 1, 2, 3];

// 打印快照
describe('Testing select', () => {
  //   it('should match alert base snapshot.', () => {
  //     const onClickMock = jest.fn();

  //     const wrapper = render(
  //       <Select type="hour" onSelect={onClickMock} onMouseEnter={onClickMock} onEsc={onClickMock} options={options} />
  //     );
  //     expect(wrapper).toMatchSnapshot();
  //   });
  //   // 测试组件是否正常渲染
  //   it('should render a DOM', () => {
  //     const wrapper = mount(<Select className="test-cls" />);
  //     expect(wrapper.find('.gio-time-picker')).toHaveLength(1);
  //   });
  it('should render a DOM', () => {
    const wrapper = mount(<Picker className="test-cls" />);
    expect(wrapper.find('.gio-time-picker')).toHaveLength(1);
  });

  it('should render null', () => {
     expect(
        mount(
          <Select
            prefixCls="gio-time-picker-select"
            options={[]}
            // selectedIndex={}
            type="ampm"
            onSelect={noop}
            onMouseEnter={noop}
            onEsc={noop}
          />
        )
      ).toMatchSnapshot()
    })

    it('disable', () => {
      expect(
         mount(
           <Select
             prefixCls="gio-time-picker-select"
             options={[{ disabled: true, value: 'test1' }, { value: 'test2'}]}
             selectedIndex={1}
             type="ampm"
             onSelect={noop}
             onMouseEnter={noop}
             onEsc={noop}
           />
         )
       ).toMatchSnapshot()
     })
    it('should render a DOM', () => {
      const wrapper = mount(<Picker className="test-cls" />);
      expect(wrapper.find('.gio-time-picker')).toHaveLength(1);
    });
});



describe('Select', () => {
  let container;

  function renderPicker(props) {
    const showSecond = true;
    const format = 'HH:mm:ss';

    return mount(
      <TimePicker
        format={format}
        showSecond={showSecond}
        defaultValue={moment('01:02:04', format)}
        {...props}
      />,
    );
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  describe('select panel', () => {
    it('select panel reacts to mouseenter and mouseleave correctly', async () => {
      const picker = renderPicker();
      clickInput(picker);

      const re = /(^|\s+)gio-time-picker-panel-select-active(\s+|$)/;

      expect(
        re.test(
          picker
            .find('.gio-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeFalsy();

      picker
        .find('.gio-time-picker-panel-select')
        .at(0)
        .simulate('mouseEnter');
      expect(
        re.test(
          picker
            .find('.gio-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeTruthy();

      picker
        .find('.gio-time-picker-panel-select')
        .at(0)
        .simulate('mouseLeave');
      expect(
        re.test(
          picker
            .find('.gio-time-picker-panel-select')
            .at(0)
            .instance().className,
        ),
      ).toBeFalsy();
    });

    it('shows only numbers according to step props', async () => {
      const picker = renderPicker({
        hourStep: 5,
        minuteStep: 15,
        secondStep: 21,
      });
      clickInput(picker);

      const selectors = picker.find('.gio-time-picker-panel-select');

      const hourSelector = selectors.at(0);
      const minuteSelector = selectors.at(1);
      const secondSelector = selectors.at(2);

      const hours = hourSelector.find('li').map(node => node.text());
      expect(hours).toEqual(['00', '05', '10', '15', '20']);

      const minutes = minuteSelector.find('li').map(node => node.text());
      expect(minutes).toEqual(['00', '15', '30', '45']);

      const seconds = secondSelector.find('li').map(node => node.text());
      expect(seconds).toEqual(['00', '21', '42']);
    });
  });

  describe('select number', () => {
    it('select number correctly', async () => {
      const picker = renderPicker();
      expect(picker.state().open).toBeFalsy();

      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      expect(picker.find('.gio-time-picker-panel-select').length).toBe(3);
    });
  });

  // describe('select to change value', () => {
  //   it('hour correctly', async () => {
  //     const onChange = jest.fn();
  //     const picker = renderPicker({
  //       onChange,
  //     });
  //     expect(picker.state().open).toBeFalsy();

  //     clickInput(picker);

  //     expect(picker.state().open).toBeTruthy();
  //     matchAll(picker, '01:02:04');

  //     clickSelectItem(picker, 0, 19);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].hour()).toBe(19);
  //     matchAll(picker, '19:02:04');
  //     expect(picker.state().open).toBeTruthy();
  //   });

  //   it('minute correctly', async () => {
  //     const onChange = jest.fn();
  //     const picker = renderPicker({
  //       onChange,
  //     });
  //     expect(picker.state().open).toBeFalsy();

  //     clickInput(picker);

  //     expect(picker.state().open).toBeTruthy();
  //     matchAll(picker, '01:02:04');

  //     clickSelectItem(picker, 1, 19);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].minute()).toBe(19);
  //     matchAll(picker, '01:19:04');
  //     expect(picker.state().open).toBeTruthy();
  //   });

  //   it('second correctly', async () => {
  //     const onChange = jest.fn();
  //     const picker = renderPicker({
  //       onChange,
  //     });
  //     expect(picker.state().open).toBeFalsy();

  //     clickInput(picker);

  //     expect(picker.state().open).toBeTruthy();
  //     matchAll(picker, '01:02:04');

  //     clickSelectItem(picker, 2, 19);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].second()).toBe(19);
  //     matchAll(picker, '01:02:19');
  //     expect(picker.state().open).toBeTruthy();
  //   });

  //   it('ampm correctly', async () => {
  //     const onAmPmChange = jest.fn();
  //     const picker = renderPicker({
  //       onAmPmChange,
  //       defaultValue: moment()
  //         .hour(0)
  //         .minute(0)
  //         .second(0),
  //       format: undefined,
  //       showSecond: false,
  //       use12Hours: true,
  //     });
  //     expect(picker.state().open).toBeFalsy();
  //     clickInput(picker);

  //     expect(picker.state().open).toBeTruthy();

  //     matchValue(picker, '12:00 am');
  //     clickSelectItem(picker, 2, 1);

  //     expect(onAmPmChange).toBeCalled();
  //     expect(onAmPmChange.mock.calls[0][0]).toBe('PM');
  //     matchValue(picker, '12:00 pm');
  //     expect(picker.state().open).toBeTruthy();
  //   });

  //   it('disabled correctly', async () => {
  //     const onChange = jest.fn();
  //     const picker = renderPicker({
  //       onChange,
  //       disabledMinutes(h) {
  //         return [h];
  //       },
  //       disabledSeconds(h, m) {
  //         return [h + (m % 60)];
  //       },
  //     });
  //     expect(picker.state().open).toBeFalsy();
  //     clickInput(picker);

  //     expect(picker.state().open).toBeTruthy();

  //     matchAll(picker, '01:02:04');

  //     clickSelectItem(picker, 1, 1);

  //     expect(onChange).not.toBeCalled();
  //     matchAll(picker, '01:02:04');
  //     expect(picker.state().open).toBeTruthy();

  //     clickSelectItem(picker, 2, 3);

  //     expect(onChange).not.toBeCalled();
  //     matchAll(picker, '01:02:04');
  //     expect(picker.state().open).toBeTruthy();

  //     clickSelectItem(picker, 1, 7);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].minute()).toBe(7);
  //     matchAll(picker, '01:07:04');
  //     expect(picker.state().open).toBeTruthy();
  //   });

  //   it('hidden correctly', async () => {
  //     const onChange = jest.fn();
  //     const picker = renderPicker({
  //       onChange,
  //       disabledHours() {
  //         return [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
  //       },
  //       hideDisabledOptions: true,
  //     });
  //     expect(picker.state().open).toBeFalsy();
  //     clickInput(picker);
  //     expect(picker.state().open).toBeTruthy();

  //     matchAll(picker, '01:02:04');

  //     clickSelectItem(picker, 0, 3);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].hour()).toBe(6);
  //     matchAll(picker, '06:02:04');
  //     expect(picker.state().open).toBeTruthy();
  //     onChange.mockReset();

  //     clickSelectItem(picker, 0, 4);

  //     expect(onChange).toBeCalled();
  //     expect(onChange.mock.calls[0][0].hour()).toBe(8);
  //     matchAll(picker, '08:02:04');
  //     expect(picker.state().open).toBeTruthy();
  //   });
  // });

  describe('select in 12 hours mode', () => {
    it('renders correctly', async () => {
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: moment()
          .hour(14)
          .minute(0)
          .second(0),
        showSecond: false,
        format: undefined,
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '2:00 pm');

      expect(picker.find('.gio-time-picker-panel-select').length).toBe(3);
    });

    it('renders 12am correctly', async () => {
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: moment()
          .hour(0)
          .minute(0)
          .second(0),
        showSecond: false,
        format: undefined,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      expect(picker.find('.gio-time-picker-panel-select').length).toBe(3);
    });

    it('renders 5am correctly', async () => {
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: moment()
          .hour(0)
          .minute(0)
          .second(0),
        showSecond: false,
        format: undefined,
      });
      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 am');
      clickSelectItem(picker, 0, 3);

      matchValue(picker, '3:00 am');
    });

    it('renders 12am/pm correctly', async () => {
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: moment()
          .hour(0)
          .minute(0)
          .second(0),
        showSecond: false,
        format: undefined,
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 am');

      clickSelectItem(picker, 2, 1);
      matchValue(picker, '12:00 pm');

      clickSelectItem(picker, 2, 0);
      matchValue(picker, '12:00 am');
    });

    it('renders uppercase AM correctly', async () => {
      const picker = renderPicker({
        use12Hours: true,
        defaultValue: moment()
          .hour(0)
          .minute(0)
          .second(0),
        showSecond: false,
        format: 'h:mm A',
      });

      expect(picker.state().open).toBeFalsy();
      clickInput(picker);
      expect(picker.state().open).toBeTruthy();

      matchValue(picker, '12:00 AM');

      clickSelectItem(picker, 2, 1);
      matchValue(picker, '12:00 PM');

      clickSelectItem(picker, 2, 0);
      matchValue(picker, '12:00 AM');
    });

    // it('disabled correctly', async () => {
    //   const onChange = jest.fn();
    //   const picker = renderPicker({
    //     use12Hours: true,
    //     format: undefined,
    //     onChange,
    //     disabledHours() {
    //       return [0, 2, 6, 18, 12];
    //     },
    //     defaultValue: moment()
    //       .hour(0)
    //       .minute(0)
    //       .second(0),
    //     showSecond: false,
    //   });

    //   expect(picker.state().open).toBeFalsy();
    //   clickInput(picker);
    //   expect(picker.state().open).toBeTruthy();

    //   matchAll(picker, '12:00 am');

    //   clickSelectItem(picker, 0, 2);
    //   expect(onChange).not.toBeCalled();
    //   matchAll(picker, '12:00 am');
    //   expect(picker.state().open).toBeTruthy();

    //   clickSelectItem(picker, 0, 5);
    //   expect(onChange).toBeCalled();
    //   expect(onChange.mock.calls[0][0].hour()).toBe(5);
    //   matchAll(picker, '5:00 am');
    //   expect(picker.state().open).toBeTruthy();
    //   onChange.mockReset();

    //   clickSelectItem(picker, 2, 1);
    //   expect(onChange).toBeCalled();
    //   matchAll(picker, '5:00 pm');
    //   expect(picker.state().open).toBeTruthy();
    //   onChange.mockReset();

    //   clickSelectItem(picker, 0, 0);
    //   expect(onChange).not.toBeCalled();
    //   matchAll(picker, '5:00 pm');
    //   expect(picker.state().open).toBeTruthy();
    //   onChange.mockReset();

    //   clickSelectItem(picker, 0, 5);
    //   expect(onChange).toBeCalled();
    //   expect(onChange.mock.calls[0][0].hour()).toBe(17);
    //   matchAll(picker, '5:00 pm');
    //   expect(picker.state().open).toBeTruthy();
    // });
  });

  // describe('other operations', () => {
  //   function testClearIcon(name, clearIcon, findClearFunc) {
  //     it(name, async () => {
  //       const onChange = jest.fn();
  //       const picker = renderPicker({
  //         clearIcon,
  //         onChange,
  //       });

  //       const clearButton = findClearFunc(picker);
  //       matchValue(picker, '01:02:04');

  //       clearButton.simulate('click');
  //       expect(picker.state().open).toBeFalsy();
  //       expect(onChange.mock.calls[0][0]).toBe(null);

  //       clickInput(picker);
  //       matchValue(picker, '');
  //     });
  //   }

  //   testClearIcon('clear correctly', 'test-clear', picker => {
  //     const clearButton = picker.find('.gio-time-picker-clear');
  //     expect(clearButton.text()).toBe('test-clear');
  //     return clearButton;
  //   });
  //   testClearIcon(
  //     'customize element clear icon correctly',
  //     <span className="test-clear-element">Clear Me</span>,
  //     picker => picker.find('.test-clear-element'),
  //   );
  // });

  it('escape closes popup', async () => {
    const picker = renderPicker();

    expect(picker.state().open).toBeFalsy();
    clickInput(picker);
    expect(picker.state().open).toBeTruthy();

    clickSelectItem(picker, 1, 1);
    escapeSelected(picker);

    expect(picker.state().open).toBeFalsy();
  });
});
