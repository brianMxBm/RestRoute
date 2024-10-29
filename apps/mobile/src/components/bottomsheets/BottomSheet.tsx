import { BottomSheetProps, BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export type CustomBottomSheetProps = Omit<BottomSheetProps, 'children'> & {
  children?: React.ReactNode;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  snapPoints?: string[];
  background?: boolean;
  index: number;
  hideIndicator?: boolean;
  pressBehavior?: 'none' | 'close' | 'collapse' | number;
};

//@TODO Version 5.X.X of @gorhom/bottom-sheet seems to not work for the BottomSheetModal? Not sure why. Look into this later

export const BottomSheet: React.FC<CustomBottomSheetProps> = (props) => {
  return (
    <BottomSheetModal
      {...props}
      handleIndicatorStyle={{
        backgroundColor: 'gray',
        // height: props.hideIndicator ? 0 : undefined,
      }}
      backdropComponent={(backdropProps) =>
        props.background && (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            pressBehavior={props.pressBehavior}
          />
        )
      }
      index={props.index}
      ref={props.bottomSheetRef}
      snapPoints={props.snapPoints}
    >
      {props.children}
    </BottomSheetModal>
  );
};
