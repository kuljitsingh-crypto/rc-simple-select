# Rc Simple Select

This is a customizable Select component for React applications. It provides a dropdown selection interface with support for single and multi-select options, search functionality, and custom styling.

## Features

- Single and multi-select modes
- Searchable options
- Customizable styling
- Keyboard navigation support
- Custom rendering of selected values
- Accessible
- Individual option customization

## Installation

``` yarn add rc-simple-select``` 

or

``` npm install rc-simple-select ```

## Usage

Here's a basic example of how to use the Select component with Options:

```jsx
import React from 'react';
import { Select,Option } from 'rc-simple-select';


const MyComponent = () => {
  const handleSelect = (value) => {
    console.log('Selected value:', value);
  };

  return (
    <Select onSelect={handleSelect}>
      <Option value="option1">Option 1</Option>
      <Option value="option2">Option 2</Option>
      <Option value="option3" disabled>Option 3</Option>
      <Option value="option4" hidden>Option 4</Option>
    </Select>
  );
};
```

## Select Component Props

The `Select` component accepts the following props:

- `isMulti`: Boolean to enable multi-select mode
- `values`: Selected value(s)
- `closeOnSelect`: Boolean to close the dropdown on selection (default: true)
- `selectClassName`: Custom class name for the select container
- `optionWrapperClassName`: Custom class name for the options wrapper
- `optionShowerClassName`: Custom class name for the selected option display
- `isSearchable`: Boolean to enable search functionality
- `placeholder`: Placeholder text when no option is selected
- `inputPlaceholder`: Placeholder text for the search input
- `label`: Label for the select component
- `selectRef`: Ref object for the select container
- `IconComponent`: Custom component for the dropdown icon
- `onSelect`: Callback function called when an option is selected
- `renderValue`: Custom render function for selected values
- `onMenuOpen`: Callback function called when the dropdown opens
- `onMenuClose`: Callback function called when the dropdown closes

## Option Component Props

The `Option` component is used to define individual options within the Select component. It accepts the following props:

- `value`: (Required) The value of the option
- `hidden`: Boolean to hide the option
- `disabled`: Boolean to disable the option
- `optionClassName`: Custom class name for the option
- `optionSelectedClassName`: Custom class name for the selected state of the option
- `optionRef`: Ref object for the option element
- `onRender`: Custom render function for the option


## Accessibility

The component is built with accessibility in mind, using appropriate ARIA attributes and keyboard navigation support. The `Option` component uses the `role="option"` attribute and includes `aria-disabled` for disabled options.

## Customization

You can customize the rendering of individual options by using the `onRender` prop of the `Option` component. This allows you to create complex option layouts or add additional functionality to each option.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.