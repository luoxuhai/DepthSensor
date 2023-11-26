package com.luoxuhai.depthsensor;

import android.graphics.ImageFormat;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.util.Log;
import android.util.Size;
import android.util.SizeF;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class DepthCameraInfoModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    DepthCameraInfoModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNDepthCameraInfo";
    }

    @ReactMethod
    public void getInfo(Promise promise) {
        WritableArray result = Arguments.createArray();

        CameraManager manager = (CameraManager) context.getSystemService(ReactApplicationContext.CAMERA_SERVICE);
        try {
            for (String cameraId : manager.getCameraIdList()) {
                CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);

                int[] capabilities = characteristics.get(CameraCharacteristics.REQUEST_AVAILABLE_CAPABILITIES);
                Integer lensFacing = characteristics.get(CameraCharacteristics.LENS_FACING);

                boolean isDepthCapable = false;
                for (int capability : capabilities) {
                    if (capability == CameraCharacteristics.REQUEST_AVAILABLE_CAPABILITIES_DEPTH_OUTPUT) {
                        isDepthCapable = true;
                        break;
                    }
                }

                if (isDepthCapable) {
                    WritableMap params = Arguments.createMap();
                    String position = (lensFacing != null && lensFacing == CameraCharacteristics.LENS_FACING_BACK) ? "back" : "front";
                    Size resolution = getResolution(manager, cameraId);
                    WritableMap fov = getFoV(manager, cameraId);
                    WritableArray formats = getDepthFormats(characteristics);

                    params.putDouble("horizontalFoV", fov.getDouble("horizontalFoV"));
                    params.putDouble("verticalFoV", fov.getDouble("verticalFoV"));
                    params.putArray("formats", formats);
                    params.putInt("width", resolution.getWidth());
                    params.putInt("height", resolution.getHeight());
                    params.putString("position", position);

                    result.pushMap(params);
                }
            }
        } catch (CameraAccessException e) {
            Log.e("RNDepthCameraInfo", e.getLocalizedMessage());
        }

        promise.resolve(result);
    }

    private Size getResolution(CameraManager cameraManager, String cameraId) {
        try {
            CameraCharacteristics characteristics = cameraManager.getCameraCharacteristics(cameraId);
            StreamConfigurationMap configs = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
            Size selectedSize = new Size(0, 0);
            for (int i : configs.getOutputFormats()) {
                if (i == ImageFormat.DEPTH16) {
                    Size[] sizes = configs.getOutputSizes(i);
                    for (Size s : sizes) {
                        if (s.getWidth() > selectedSize.getWidth() && s.getHeight() > selectedSize.getHeight()) {
                            selectedSize = s;
                        }
                    }
                }
            }
            return selectedSize;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private WritableArray getDepthFormats(CameraCharacteristics characteristics) {
        WritableArray result = Arguments.createArray();

        StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
        if (map != null) {
            for (int format : map.getOutputFormats()) {
                if (format == ImageFormat.DEPTH16) {
                    result.pushString("DEPTH16");
                } else if (format == ImageFormat.DEPTH_POINT_CLOUD) {
                    result.pushString("DEPTH_POINT_CLOUD");
                } else if (format == ImageFormat.DEPTH_JPEG) {
                    result.pushString("DEPTH_JPEG");
                }
            }
        }

        return result;
    }

    private WritableMap getFoV(CameraManager manager, String cameraId) {
        WritableMap result = Arguments.createMap();

        try {
                CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);

                float[] focalLengths = characteristics.get(CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS);
                SizeF sensorSize = characteristics.get(CameraCharacteristics.SENSOR_INFO_PHYSICAL_SIZE);
                if (focalLengths != null && sensorSize != null) {
                    float focalLength = focalLengths[0];

                    float horizontalFoV = (float) (2 * Math.atan(sensorSize.getWidth() / (2 * focalLength)));
                    float verticalFoV = (float) (2 * Math.atan(sensorSize.getHeight() / (2 * focalLength)));

                    // 转换为度
                    horizontalFoV = horizontalFoV * 180 / (float) Math.PI;
                    verticalFoV = verticalFoV * 180 / (float) Math.PI;

                    result.putDouble("horizontalFoV", horizontalFoV);
                    result.putDouble("verticalFoV", verticalFoV);
                }
        } catch (CameraAccessException e) {
            Log.e("RNDepthCameraInfo", e.getLocalizedMessage());
        }

        return result;
    }
}
