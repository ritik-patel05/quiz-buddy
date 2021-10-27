import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';

export const ConfirmationDialog = (props) => {
  const {
    onClose,
    value: valueProp,
    open,
    answeredCount,
    unansweredCount,
    ...other
  } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose('success');
  };

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': { width: '80%', maxHeight: 435 },
      }}
      maxWidth="sm"
      open={open}
      {...other}
    >
      <div className="px-12 py-10">
        <h2 className="text-center h4">Do you really want to end the test?</h2>

        <div className="flex flex-wrap my-6 items-center justify-between">
          <div className="flex items-center mb-3">
            <div className="bullet bg-green-400 border-green-400 mr-2"> </div>
            <p className="text-sm font-normal"> {answeredCount} answered </p>
          </div>
          <div className="flex items-center mb-3">
            <div className="bullet bg-white border-gray-400 mr-2"> </div>
            <p className="text-sm font-normal">{unansweredCount} unanswered</p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            className="btn bg-green-400 text-white mr-4"
            onClick={handleOk}
          >
            End Test
          </button>
          <button className="btn" onClick={handleCancel}>
            Resume
          </button>
        </div>
      </div>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};
