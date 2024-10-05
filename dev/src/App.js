import React from "react";
import { Option, Select } from "../../src";
// import {} from ""

// import * as s from "rc-simple-select"
function App() {
  return (
    <div className='root'>
      <Select
        isMult={true}
        onSelect={(value) => {
          console.log(value);
        }}
        initialValues={["c", "d"]}>
        <Option value='a'>a</Option>
        <Option value='b'>b</Option>
        <Option value='c'>c</Option>
        <Option value='d'>d</Option>
        <Option value='e'>e</Option>
        <div>fgdf gfd </div>
      </Select>
      <select>
        <option value='a'>a</option>
        <option value='b' hidden>
          b
        </option>
        <option value='c'>c</option>
        <option value='d'>d</option>
        <option value='e'>e</option>
      </select>
      <input list='fruits' id='fruitInput' name='fruitInput' />
      <datalist id='fruits'>
        <option value='Apple' />
        <option value='Banana' />
        <option value='Grapes' />
        <option value='Orange' />
        <option value='Peach' />
      </datalist>
    </div>
  );
}

export default App;
