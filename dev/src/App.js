import React from "react";
import { Option, Select } from "../../src";
// import {} from ""

// import * as s from "rc-simple-select"
function App() {
  return (
    <div className='root'>
      <Select
        // isMult={true}
        onSelect={(value) => {
          console.log(value);
        }}
        // placeholder='fsdfsd'
        isSearchable={true}>
        <Option value='a' hidden>
          a
        </Option>
        <Option value='b' disabled>
          b
        </Option>
        <Option value='c'>c</Option>
        <Option value='d'>d</Option>
        <Option value='e'>e</Option>
        <Option value='Apple'>Apple</Option>

        <div>fgdf gfd </div>
      </Select>
      <select placeholder='dashdh'>
        <option value='a' hidden>
          a
        </option>
        <option value='b' disabled>
          b
        </option>
        <option value='c' disabled>
          c
        </option>
        {/* <option value='d'>d</option>
        <option value='e'>e</option>
        <option value='@'>@</option>
        <option value='Apple'>Apple</option>
        <option value='Abba'>Abba</option> */}
      </select>
      <input list='fruits' id='fruitInput' name='fruitInput' />
      <datalist id='fruits'>
        <option value='a' />
        <option value='Apple' />
        <option value='Banana' />
        <option value='Grapes' />
        <option value='Orange' />
        <option value='Peach' />
        <option value='Pech' />
      </datalist>
    </div>
  );
}

export default App;
