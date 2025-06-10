export const ENDPOINT: { [key: string]: string } = {
    '01': 'single-command', // Data transmission from the PC to the DALI network (command)
    '02': 'command-feedback', // Data transmission from the DALI network to the PC (command feedback)
    '03': 'dui-control', // Data transmission from the PC to the DALI network (DUI control)
    '04': 'dui-control-feedback', // Data transmission from the DALI network to the PC (DUI control feedback)
    '05': 'repeat-command', // Data transmission from the PC to the DALI network (repeat command)
    '06': 'update-dali-command', // Data transmission from the PC to the DALI network (fast DALI command)
    '07': 'update-dali-command-feedback' // Data transmission from the DALI network to the PC (fast DALI command feedback)
};

export const DATA_TYPE: { [key: string]: string } = {
    '1': 'direct-response', // Direct response to a command
    '2': 'address-result', // Result of an address command
    '3': 'beg-command-received', // BEG command received
    '4': 'beg-command-transmitted', // BEG command transmitted
    '5': 'command-received', // Command received
    '6': 'command-transmitted', // Command transmitted
    '7': 'command-response', // Command response
    '8': 'beg-command-response', // BEG command response
    '9': 'monitor-response', // Monitor response
    A: 'beg-monitor-response', // BEG monitor response
    B: 'address-additional-result' // Additional result of an address command
};
