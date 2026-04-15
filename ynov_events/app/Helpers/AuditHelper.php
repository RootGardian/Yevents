<?php

namespace App\Helpers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditHelper
{
    /**
     * Log an action to the audit_logs table.
     *
     * @param string $action
     * @param string $description
     * @param Model|null $model
     * @param array $extraMetadata
     * @return AuditLog
     */
    public static function log($action, $description, $model = null, $extraMetadata = [])
    {
        $user = Auth::user();
        
        $metadata = array_merge([
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'url' => Request::fullUrl(),
            'method' => Request::method(),
        ], $extraMetadata);

        return AuditLog::create([
            'user_id' => $user ? $user->id : null,
            'user_type' => $user ? (class_basename($user) === 'Admin' ? 'Admin' : 'User') : 'System',
            'action' => strtoupper($action),
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model ? $model->id : null,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
